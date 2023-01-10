import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { SuccessResponse } from 'src/common/helper/response';
import {
    JoiValidationPipe,
    RemoveEmptyQueryPipe,
    TrimBodyPipe,
} from 'src/common/pipes';
import { UpdateNotificationBody } from './notification.dto';
import { INotificationGetListQuery } from './notification.interfaces';
import {
    notificationGetListSchema,
    updateNotificationSchema,
} from './notification.validator';
import { NotificationService } from './services/notification.service';

@Controller('/notifications')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Get('/')
    async getNotificationList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(notificationGetListSchema),
        )
        query: INotificationGetListQuery,
    ) {
        try {
            const result = await this.notificationService.getList(query);
            return new SuccessResponse(result);
        } catch (error) {
            throw error;
        }
    }

    @Patch('/:id')
    async updateNotification(
        @Param('id') id: string,
        @Body(
            new TrimBodyPipe(),
            new JoiValidationPipe(updateNotificationSchema),
        )
        body: UpdateNotificationBody,
    ) {
        try {
            const updatedReport = await this.notificationService.update(
                id,
                body,
            );
            return updatedReport;
        } catch (error) {
            throw error;
        }
    }
}
