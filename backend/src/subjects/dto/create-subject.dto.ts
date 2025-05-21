import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
    @IsNotEmpty()
    @IsString()
    subjectName: string;

    @IsNotEmpty()
    @IsNumber()
    totalGrads: number;

    @IsOptional()
    @IsNumber()
    parentId?: number;
}
