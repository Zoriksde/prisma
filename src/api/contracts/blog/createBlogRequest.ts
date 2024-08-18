import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class CreateBlogRequest {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PostRequest)
  posts: PostRequest[];
}

class PostRequest {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  title?: string;
}
