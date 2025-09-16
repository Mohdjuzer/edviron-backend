import { IsNumber, IsString, Min, Max, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value))
  @Min(1)
  @Max(100000)
  readonly amount: number;

  // We can add more fields here if needed
  // Example:
  // @IsString()
  // @IsNotEmpty()
  // someField: string;
}
