import cron from 'node-cron';
import { taskRepository } from '../repository/task.repository';
import { sendToClients } from '../middleware/sseHandler';

export const scheduleNotifications = () => {
    // 매 1분마다 실행
    cron.schedule('*/1 * * * *', async () => {
        try {
            const notifications = await taskRepository.getTasksDue();

            for (const notification of notifications) {
                const { taskId, messages } = notification;

                // 리포지토리에서 task와 user, members 정보 조회
                const task = await taskRepository.findTaskWithMembers(taskId);
                if (!task) continue;

                const { user, members } = task;

                // 작업 작성자에게 알림 메시지 전송
                for (const message of messages) {
                    //console.log(`작업 작성자에게 알림 전송: ${message}`);
                    sendToClients(JSON.stringify({ userId: user.uuid, message }));

                    // 참여자들에게 알림 메시지 전송
                    for (const member of members) {
                        //console.log(`참여자에게 알림 전송: ${message}`);
                        sendToClients(JSON.stringify({ userId: member.uuid, message }));
                    }
                }
            }
        } catch (error) {
            console.error('알림 전송 중 오류 발생:', error);
        }
    });
};