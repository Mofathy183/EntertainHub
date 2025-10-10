import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { createId } from '@paralleldrive/cuid2';
import { MoodEnum } from './anime.dto';
import { toTitleCase } from './anime.utility';

@Schema({ timestamps: true })
export class Quote {
	@Prop({
		type: String,
		required: true,
		default: () => createId(),
	})
	_id!: string;

	@Prop({
		type: String,
		ref: 'Anime',
		required: [true, 'Every quote needs an animeId.'],
	})
	animeId!: Anime | string;

	@Prop({
		type: String,
		required: [
			true,
			'Every quote needs a character — even background NPCs.',
		],
		trim: true,
		minLength: [1, 'Character name too short. Even "Gon" is longer.'],
		maxLength: [
			100,
			'Character name too long. Keep it under 100 characters.',
		],
	})
	character!: string;

	@Prop({
		type: String,
		required: [true, 'A quote without words? Are we in a silent anime?'],
		trim: true,
		minLength: [2, 'Quote too short. Even "Dattebayo!" is longer.'],
		maxLength: [300, 'Quote too long. This isn’t a light novel.'],
	})
	quote!: string;

	@Prop({
		type: String,
		enum: Object.values(MoodEnum),
		default: MoodEnum.Epic,
	})
	mood!: MoodEnum;

	@Prop({
		type: Number,
		min: [0, 'Power level can’t be negative. Even Yamcha has 1.'],
		max: [9000, 'Power level too high! Vegeta’s scouter exploded.'],
		default: () => Math.floor(Math.random() * 500) + 50,
	})
	powerLevel?: number;
}

export type QuoteDocument = HydratedDocument<Quote>;
export const QuoteSchema = SchemaFactory.createForClass(Quote);

@Schema({ timestamps: true, collection: 'animes' })
export class Anime {
	@Prop({
		type: String,
		required: true,
		default: () => createId(),
	})
	_id!: string;

	@Prop({
		type: String,
		required: true,
		trim: true,
		minLength: [2, 'Anime title too short. Even "JoJo" is longer.'],
		maxLength: [
			100,
			'Anime title too long. Calm down, light novel author.',
		],
		unique: true,
		set: (val: string) => toTitleCase(val),
	})
	title!: string;

	@Prop({
		type: String,
		required: [
			true,
			'Every anime needs a protagonist. Even if they die in episode 1.',
		],
		trim: true,
		minLength: [2, 'Protagonist name too short. Even "Gon" is longer.'],
		maxLength: [
			100,
			'Protagonist name too long. Calm down, One Piece side characters.',
		],
	})
	protagonist!: string;

	@Prop({
		type: String,
		default: 'High School (obviously)',
		trim: true,
	})
	universe?: string;

	@Prop({ type: [{ type: String, ref: 'Quote' }], default: [] })
	quotes?: Quote[];
}

export type AnimeDocument = HydratedDocument<Anime>;
export const AnimeSchema = SchemaFactory.createForClass(Anime);
