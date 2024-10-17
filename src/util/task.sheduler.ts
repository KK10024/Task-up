import cron from 'node-cron';
import { taskRepository } from '../repository/task.repository';
import { sendToClients } from '../middleware/sseHandler';

export const scheduleNotifications = () => {
    // */1 * * * * 매 1분마다 실행 1 * * * * 매 시간 1분마다 실행 
    cron.schedule('0 0 * * *', async () => {
        try {
            const notifications = await taskRepository.getTasksDue();

            for (const notification of notifications) {
                const { taskId, messages } = notification;
            
                const task = await taskRepository.findTaskWithMembers(taskId);
                if (!task) continue;
            
                const { user, members } = task;
            
                for (const message of messages) {
                    sendToClients(JSON.stringify({ userId: user.uuid, message }));
            
                    for (const member of members) {
                        sendToClients(JSON.stringify({ userId: member.uuid, message }));
                    }
                }
            }
        } catch (e) {
            console.error('알림 전송 중 오류 발생:', e);
            sendToClients(JSON.stringify({ message: '알림 전송 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.' }));
        }
    });
};

