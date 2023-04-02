import axios from 'axios';

export const sheetActions = {
  getSheets: () => axios.get('/api/quest/'),
  setActiveSheet: (sheetId: string) => axios.post('/api/quest/', JSON.stringify({
    'sheetId': sheetId,
  }), {
    headers: { 'Content-Type': 'application/json' },
  }),
};