// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { QuestInterface } from '@/types';

type Data = {
  created_at: Date
  expires_at: Date
  questions: QuestInterface[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({
    created_at: new Date(),
    expires_at: new Date(),
    questions: [
      {
        question: 'Who Invented Blockchain Technology?',
        selection: 'single',
        options: ['Satoshi Nakamoto', 'Linus Torvalds', 'Bill Gates', 'Reid Hoffman'],
      },
      {
        question: 'What is Pitpa Learn to Earn?',
        selection: 'single',
        options: ['A Web hosting platform', 'An internet service provider', 'A learning platform', 'An Automated Teller Machine'],
      },
      {
        question: 'What can you earn through Pitpa Learn to Earn?',
        selection: 'multiple',
        options: ['NFTs', 'Certifications', 'Cryptocurrency', 'Real Cash'],
      },
      {
        question: 'What is Cryptocurrency?',
        selection: 'multiple',
        options: [
          'A digital currency in which transactions are verified and records maintained by a decentralized system using cryptography, rather than by a centralized authority.',
          'An internet-based medium of exchange which uses cryptographical functions to conduct financial transactions',
          'A form of money that is centralized, backed, and managed by a recognized government entity',
          'There is no word such as cryptocurrency'
        ],
      },
    ],
  });
}
