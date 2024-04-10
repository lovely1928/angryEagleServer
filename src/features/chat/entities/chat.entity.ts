import * as   moment from 'moment-timezone';
import { nanoid } from 'nanoid';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BaseEntity, BeforeInsert, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Chat extends BaseEntity {

    @PrimaryColumn()
    id: string;

    @Column()
    from: string;

    @Column()
    to: string;

    @Column()
    message: string;

    @Column({ default: moment().unix() })
    time: number;

    @Column({ default: moment().unix() })
    seenAt: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isSeen: boolean;

    @Column()
    conversationId: string;

    @Column({ default: false })
    isDelivered: boolean;

    @BeforeInsert()
    generateId() {
        this.id = nanoid(); // This will generate a unique nanoid for the ID
    }

}
