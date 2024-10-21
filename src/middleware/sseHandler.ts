import { Request, Response } from 'express';

let clients = [];

export const sseHandler = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: 연결되었습니다\n\n`);

    // 클라이언트를 배열에 추가
    clients.push(res);

    res.on('error', (error) => {
        console.error('클라이언트와의 연결에서 오류 발생:', error);
    });
    // 연결이 종료되면 클라이언트를 배열에서 제거
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
};

// 클라이언트에게 메시지 전송
export const sendToClients = (message: string) => {
    clients.forEach(client => {
        client.write(`data: ${message}\n\n`);
    });
};