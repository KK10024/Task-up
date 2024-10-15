import cron from 'node-cron';
import { sendMail } from './mailer';
import { taskRepository } from '../repository/task.repository';

cron.schedule('0 9 * * *', async () => {
    try {
        const tasksDue = await taskRepository.getTasksDue();
        if (tasksDue.length > 0) {
            tasksDue.forEach(task => {
                sendMail(task.user.email, 'Task Due Reminder', `Task ${task.title} is due soon!`);
            });
        } else {
            console.log('No tasks due for notification.');
        }
    } catch (e) {
        console.error('Error checking tasks:', e);
    }
});

