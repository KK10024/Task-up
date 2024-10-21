import cron from 'node-cron';
import { taskRepository } from '../repository/task.repository';
import { sendToClients } from '../middleware/sseHandler';

export const scheduleNotifications = () => {
    cron.schedule('0 */6 * * *', async () => {
        try {
            const notifications = await taskRepository.getTasksDue();

            for (const notification of notifications) {
                const { taskId, messages, user } = notification;

                for (const message of messages) {
                    sendToClients(JSON.stringify({ taskId: taskId, userId: user.uuid, message }));
                }
            }
        } catch (e) {
            console.error('알림 전송 중 오류 발생:', e);
            sendToClients(JSON.stringify({ message: '알림 전송 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.' }));
        }
    });
};