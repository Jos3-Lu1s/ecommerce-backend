import { IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @Column({ nullable: true })
  image!: string;
}
