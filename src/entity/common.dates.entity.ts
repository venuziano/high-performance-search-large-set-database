import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class CommonDatesEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  updated_at: Date;
}
