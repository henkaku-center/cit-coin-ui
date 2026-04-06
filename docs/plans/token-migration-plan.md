# 実装計画: cJPY → JOIN + ICHIGO トークン移行 & LearnToEarn非表示化

## 概要

cJPYトークンを2つの新トークン（JOIN / ICHIGO）に置き換え、LearnToEarn機能をUI上から非表示にする。

## 要件

1. **cJPY → JOIN**: 成績・学習の可視化トークン。NFTミントに使用
2. **ICHIGO 追加**: コミュニティ内の価値交換トークン。送り合い可能
3. **LearnToEarn非表示化**: コードは残しつつ、ナビ・ページから非表示
4. 両トークンともcJPYと同じABI（ERC20 + RBAC）

## 前提・依存

- JOIN / ICHIGO コントラクトは `cit-coin-contract` 側で別途デプロイ済み（or デプロイ予定）
- CitNFTコントラクトは既存のものをそのまま使用（再デプロイ不要）
- LearnToEarnコントラクトもそのまま残す（Admin権限チェックに使用中）
- Henkaku APIがNFT画像に「cJPY」と印字している場合、API側の対応も別途必要

---

## Phase 1: コントラクト接続層の変更

### 対象ファイル
- `src/utils/contract/ContractAddress.tsx`
- `src/hooks/useContractConfig.ts`
- `.env.example`

### 変更内容

**ContractAddress.tsx:**
- `cJPY` → `JOIN` にリネーム
- `ICHIGO` を追加

```typescript
const contractAddress: ContractAddress = {
  JOIN: process.env.NEXT_PUBLIC_JOIN_ADDRESS as `0x${string}`,
  ICHIGO: process.env.NEXT_PUBLIC_ICHIGO_ADDRESS as `0x${string}`,
  LearnToEarn: process.env.NEXT_PUBLIC_LEARN_TO_EARN_ADDRESS as `0x${string}`,
  NFT: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
  Faucet: process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}`,
};
```

**useContractConfig.ts:**
- 引数型に `'JOIN' | 'ICHIGO'` を追加（`'cJPY'` を `'JOIN'` に置換）
- JOIN / ICHIGO はcJPYと同じABIを使用

```typescript
export const UseContractConfig = (name: 'JOIN' | 'ICHIGO' | 'LearnToEarn' | 'NFT' | 'Faucet') => {
  // JOIN, ICHIGO → cJPY ABI（同一仕様）
};
```

**.env.example:**
```
NEXT_PUBLIC_JOIN_ADDRESS="0x..."
NEXT_PUBLIC_ICHIGO_ADDRESS="0x..."
# NEXT_PUBLIC_CJPY_ADDRESS は削除
```

---

## Phase 2: ホームページ — トークン残高表示の更新

### 対象ファイル
- `src/components/wallet/ContractDetail.tsx`

### 変更内容
- cJPY残高 → JOIN残高 + ICHIGO残高の2つを表示
- コントラクトアドレス一覧を更新（JOIN / ICHIGO）
- LearnToEarnコントラクトアドレス表示を削除

```
変更前: cJPY残高 1つ + cJPY/LearnToEarn/NFT/自分のアドレス表示
変更後: JOIN残高 + ICHIGO残高 + JOIN/ICHIGO/NFT/自分のアドレス表示
```

---

## Phase 3: NFTミント機能の更新

### 対象ファイル
- `src/components/NFT.tsx`
- `src/pages/api/nft.ts`
- `src/utils/svgUtils.ts`

### 変更内容

**NFT.tsx:**
- `UseContractConfig('cJPY')` → `UseContractConfig('JOIN')`
- UI表記の「cJPY」→「JOIN」（バッジ、ボタン等）
- approve対象をJOINコントラクトに変更

**api/nft.ts:**
- cJPYコントラクト参照 → JOINコントラクトに変更
- 環境変数: `NEXT_PUBLIC_CJPY_ADDRESS` → `NEXT_PUBLIC_JOIN_ADDRESS`
- 最低残高チェック（8000）はそのまま（後日変更可能）

**svgUtils.ts:**
- NftLevelsの「cJPY」表記 → 「JOIN」に変更

### 要確認事項
- Henkaku API (`/ipfs/cit`) がNFT画像に「cJPY」を印字している場合、API側の修正が別途必要
- NFTミント条件（必要JOIN数・成績閾値）はスペック上「後日決定」→ 現状の8000を仮置き

---

## Phase 4: LearnToEarn非表示化

### 対象ファイル
- `src/layouts/Layout.tsx`
- `src/pages/admin.tsx`

### 変更内容

**Layout.tsx（ナビゲーション）:**
- `/quests` リンクを非表示にする（コメントアウト or フラグ制御）

```tsx
// 変更前
{isConnected && chain?.id === defaultChain.id && (
  <NavLink href={'/quests'}>{t('nav.QUESTS')}</NavLink>
)}

// 変更後: 非表示（コード残す）
{/* LearnToEarn: 現在非表示
{isConnected && chain?.id === defaultChain.id && (
  <NavLink href={'/quests'}>{t('nav.QUESTS')}</NavLink>
)}
*/}
```

**admin.tsx（管理画面）:**
- LearnToEarn関連タブを非表示にする:
  - Questions Manager（`QuestionManager`）→ 非表示
  - Manage Students（`StudentManager`）→ 非表示
  - Settings（`RewardPointSetting`）→ 非表示
- 残すタブ:
  - Faucet
  - Statistics

### 残すファイル（変更なし）
- `src/pages/quests.tsx` — ファイルそのまま
- `src/components/Answersheet.tsx` — そのまま
- `src/components/admin/QuestionManager.tsx` — そのまま
- `src/components/admin/StudentManager.tsx` — そのまま
- `src/components/admin/Settings.tsx` — そのまま
- `src/utils/abis/LearnToEarn.json` — そのまま

---

## Phase 5: 環境変数・翻訳ファイルの更新

### 対象ファイル
- `.env.example`
- `locales/en/*.json`
- `locales/ja/*.json`

### 変更内容
- 環境変数: JOIN / ICHIGO アドレスを追加、CJPY を削除
- i18n: 「cJPY」→「JOIN」、ICHIGO関連テキスト追加
- ウォレット表示のラベル更新

---

## デプロイが必要なもの（cit-coin-contract側）

| コントラクト | 対応 |
|-------------|------|
| JOINトークン | 新規デプロイ（cJPYと同一仕様） |
| ICHIGOトークン | 新規デプロイ（cJPYと同一仕様） |
| CitNFT | 不要（既存利用） |
| LearnToEarn | 不要（既存利用） |
| Faucet | 不要（既存利用） |

---

## リスク

| リスク | レベル | 対策 |
|--------|--------|------|
| Admin権限チェックがLearnToEarnコントラクトに依存 | MEDIUM | コントラクトは残すので当面影響なし。将来的に独立した権限管理を検討 |
| Henkaku APIがNFT画像にcJPYと印字 | MEDIUM | API側の仕様確認が必要。別途対応 |
| NFTミント条件の最終決定が未定 | LOW | 現状の8000を仮置き、後から環境変数等で変更可能にする |

---

## 実装順序

```
Phase 1 (コントラクト接続層)
  ↓
Phase 2 (残高表示) + Phase 3 (NFT) ← 並行可能
  ↓
Phase 4 (LearnToEarn非表示)
  ↓
Phase 5 (env / i18n)
```
