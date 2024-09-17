import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  IsEmail,
  Length,
  Unique,
  AllowNull,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'Users',
  timestamps: true,
})
export class Users extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Unique
  @AllowNull(true)
  @IsEmail
  @Column({
    type: DataType.STRING(255),
  })
  email!: string;

  @Unique
  @AllowNull(true)
  @Length({ min: 10, max: 15 })
  @Column({
    type: DataType.STRING(15),
  })
  phone!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  password!: string;
}
