import express, { Request, Response } from 'express';

const router = express.Router({ mergeParams: true });

router.post('/', async (req: Request, res: Response): Promise<void> => {
  console.log('req from bx24:', req);
  const messages = [
    'Hmmm... nice question, it seems I do not know the answer',
    'Let me think about it a little bit...',
    'Your questions show that you are a very smart person',
    'Live me alone please, I need some rest',
    'Why do you have so many questions? Talk to someone else',
    'I have a lazy day today. Do not disturb me',
    'What a stupid question. Do you have nothing to do?'
  ];

res.status(200).json({
  text: `${messages[Math.floor(Math.random()*7)]}`
});
});

export default router;
