import { Request, Response } from 'express';

class SSEManager {
    private clients: Response[] = [];

    addClient(res: Response) {
        this.clients.push(res);
    }

    removeClient(res: Response) {
        this.clients = this.clients.filter(client => client !== res);
    }

    sendToAll(message: string) {
        this.clients.forEach(client => {
            client.write(`data: ${message}\n\n`);
        });
    }
}

// 새로운 SSEManager 인스턴스를 만들어 관리
const sseManager = new SSEManager();

export const sseHandler = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: 연결되었습니다\n\n`);

    // 클라이언트를 SSEManager에 추가
    sseManager.addClient(res);

    req.on('close', () => {
        sseManager.removeClient(res);
    });
};

export const sendToClients = (message: string) => {
    sseManager.sendToAll(message);
};