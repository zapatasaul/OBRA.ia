import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// @ts-ignore: TypeORM uses legacy decorators and this project is currently type-checked with incompatible decorator signatures.
@Entity()
export class User {
    // @ts-ignore: TypeORM uses legacy decorators and this project is currently type-checked with incompatible decorator signatures.
    @PrimaryGeneratedColumn()
    id!: number;

    // @ts-ignore: TypeORM uses legacy decorators and this project is currently type-checked with incompatible decorator signatures.
    @Column()
    proyectName!: string;

    // @ts-ignore: TypeORM uses legacy decorators and this project is currently type-checked with incompatible decorator signatures.
    @Column()
    date!: String;

    // @ts-ignore: TypeORM uses legacy decorators and this project is currently type-checked with incompatible decorator signatures.
    @Column()
    proyectDescription!: String;

    // @ts-ignore: TypeORM uses legacy decorators and this project is currently type-checked with incompatible decorator signatures.
    @Column()
    location!: String;

    // @ts-ignore: TypeORM uses legacy decorators and this project is currently type-checked with incompatible decorator signatures.
    @Column()
    apiResult!: String;
}