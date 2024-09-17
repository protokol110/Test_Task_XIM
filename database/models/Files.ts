import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    AllowNull,
} from 'sequelize-typescript';
import {Users} from './Users';

@Table({
    tableName: 'Files',
    timestamps: true,
})
export class File extends Model {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    id!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
    })
    fileName!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
    })
    mimeType!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING,
    })
    extension!: string;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
    })
    fileSize!: number;
    @AllowNull(false)
    @Column({
        type: DataType.STRING,
    })
    filePath!: string;

    @ForeignKey(() => Users)
    @AllowNull(false)
    @Column({
        type: DataType.UUID,
    })
    userId!: string;

    @BelongsTo(() => Users)
    user!: Users;
}
