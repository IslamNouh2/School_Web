import { PartialType } from '@nestjs/mapped-types';
import { CreateSubjectDto } from './create-subject.dto';
import { IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';


export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
    @IsString()
    @IsNotEmpty()
    subjectName: string;

    @IsInt()
    totalGrads: number;

    @IsOptional()
    @IsInt()
    parentId?: number;
}