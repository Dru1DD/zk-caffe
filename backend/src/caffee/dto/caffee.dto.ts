import { IsString, IsNumber, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateLoyaltyCardDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}

export class AddStampDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  newImageUrl: string;
}

export class BuyCoffeeDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  cardId: string;

  @IsString()
  @IsNotEmpty()
  coinId: string;

  @IsString()
  @IsOptional()
  coinType?: string;
}

export class RedeemFreeCoffeeDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  cardId: string;
}

export class UpdateConfigDto {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsNumber()
  @Min(0)
  newPrice: number;

  @IsString()
  @IsNotEmpty()
  newTreasury: string;
}

export class ExecuteTransactionDto {
  @IsString()
  @IsNotEmpty()
  digest: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
