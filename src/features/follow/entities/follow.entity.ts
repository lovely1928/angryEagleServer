
import * as moment from 'moment-timezone';
import { nanoid } from 'nanoid';
import { FollowStatus } from 'src/common/enums/followStatus.enum';
import { User } from 'src/features/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, BaseEntity, BeforeInsert, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class Follow extends BaseEntity {

    @PrimaryColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    followedBy: string;

    @Column({
        type: "enum",
        enum: FollowStatus,
        default: FollowStatus.INACTIVE,
    })
    status: string;

    @ManyToOne(() => User, (user) => user.follower)
    @JoinColumn({ name: "followedBy" })
    follower: User
    
    @ManyToOne(() => User, (user) => user.following)
    @JoinColumn({ name: "userId" })
    following: User 

    @BeforeInsert()
    generateId() {
        this.id = nanoid(); // This will generate a unique nanoid for the ID
    }

//     @Column({ default: () => moment().unix() })
//     public created_at: number;

//     @Column({ default: () => moment().unix() })
//     public updated_at: number;
}
