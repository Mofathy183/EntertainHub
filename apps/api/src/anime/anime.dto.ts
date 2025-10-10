import { PartialType } from '@nestjs/mapped-types';
import {
	IsString,
	IsNotEmpty,
	MinLength,
	MaxLength,
	IsInt,
	Min,
	Max,
	IsEnum,
	IsOptional,
} from 'class-validator';

//* the database file for anime and quotes Models
export enum MoodEnum {
	Inspirational = 'inspirational',
	Funny = 'funny',
	Serious = 'serious',
	Dramatic = 'dramatic',
	Motivational = 'motivational',
	Philosophical = 'philosophical',
	Epic = 'epic',
	Emotional = 'emotional',
	Villainous = 'villainous',
}

//* DTOs Validation can be added here using class-validator and class-transformer decorators
//* the DTOs for creating and updating anime and quotes Models
export class CreateAnimeDto {
	static meta: { type: 'create'; category: 'anime' } = {
		type: 'create',
		category: 'anime',
	};

	@IsString({
		message:
			'Oi! The title must be a string. This isn’t a Dragon Ball Z power level.',
	})
	@MinLength(2, {
		message:
			'Title is too short. Even One Piece arcs are longer than 2 characters.',
	})
	@MaxLength(100, {
		message: 'Title is too long. Calm down, light novel author.',
	})
	@IsNotEmpty({ message: 'Title is required. What is this, filler episode?' })
	title!: string;

	@IsString({
		message:
			'Protagonist must be a string. No, you can’t just yell BANKAI.',
	})
	@MinLength(2, {
		message:
			'Protagonist name too short. Even Gon made it past that length.',
	})
	@MaxLength(100, {
		message:
			'Protagonist name too long. Calm down, One Piece side characters.',
	})
	@IsNotEmpty({
		message:
			'Every anime needs a protagonist. Even if they die in episode 1.',
	})
	protagonist!: string;

	@IsOptional()
	@IsString({
		message:
			'Universe must be a string. Sadly, no isekai portals allowed here.',
	})
	universe?: string;
}

//* the DTOs for creating and updating quotes Models
export class CreateQuoteDto {
	static meta: { type: 'create'; category: 'quote' } = {
		type: 'create',
		category: 'quote',
	};

	@IsString({
		message:
			'Character name must be a string. Not a jutsu, not a stand, a string.',
	})
	@MinLength(2, {
		message:
			'Character name is too short. Even Krillin lasted longer than that.',
	})
	@MaxLength(100, {
		message:
			'Character name too long. Keep it under 100, not the entire Uchiha clan tree.',
	})
	@IsNotEmpty({
		message:
			'Character name is required. Don’t make me use Talk no Jutsu on you.',
	})
	character!: string;

	@IsString({
		message:
			'Quote must be a string. Unless you’re trying to summon Shenron, keep it simple.',
	})
	@MinLength(2, {
		message: 'Quote too short. Even Pikachu says more than that.',
	})
	@MaxLength(300, {
		message:
			'Quote too long. This isn’t a 3-volume monologue from Light Yagami.',
	})
	@IsNotEmpty({
		message:
			'Quote is required. You can’t just stare intensely and call it a quote.',
	})
	quote!: string;

	@IsEnum(MoodEnum, {
		message: 'Mood must be a valid enum. No “Chill Vibes Only” nonsense.',
	})
	mood!: MoodEnum;

	@IsOptional()
	@IsInt({
		message:
			'Power level must be an integer. Stop trying decimal Super Saiyan forms.',
	})
	@Min(0, { message: 'Power level can’t be negative. Even Yamcha has 1.' })
	@Max(9000, { message: 'Power level too high! Vegeta’s scouter exploded.' })
	powerLevel?: number;
}

//* the DTO for updating anime Models
export class UpdateAnimeDto extends PartialType(CreateAnimeDto) {
	static meta: { type: 'update'; category: 'anime' } = {
		type: 'update',
		category: 'anime',
	};
}

//* the DTO for updating quote Models
export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {
	static meta: { type: 'update'; category: 'quote' } = {
		type: 'update',
		category: 'quote',
	};
}

export interface IDelete {
	_id: string;
	isDeleted: boolean;
	count: number;
}

export type IQuote = {
	_id?: string;
	animeId?: string;
	character: string;
	quote: string;
	mood: MoodEnum;
	powerLevel?: number;
};

export interface IAnime {
	_id?: string;
	title: string;
	protagonist: string;
	universe?: string;
	quotes?: IQuote[];
}

//* the anime and quotes for creating and updating Models
export type IUpdateQuote = Partial<IQuote>;

export type IUpdateAnime = Partial<IAnime>;
