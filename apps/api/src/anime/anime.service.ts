import { Injectable } from '@nestjs/common';
import {
	CreateAnimeDto,
	CreateQuoteDto,
	UpdateQuoteDto,
	UpdateAnimeDto,
} from './anime.dto';
import { AnimeThrowError } from './anime.filter';
import { Anime, Quote, AnimeDocument, QuoteDocument } from './anime.schema';
import { Model, DeleteResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AnimeService {
	constructor(
		@InjectModel(Anime.name) private animeModel: Model<AnimeDocument>,
		@InjectModel(Quote.name) private quoteModel: Model<QuoteDocument>,
	) {}

	//* will add the service methods here

	async getAllAnime(limit: number, quotes: number): Promise<AnimeDocument[]> {
		try {
			//* first get the animes from the db with the limit
			const animeList = await this.animeModel
				.find()
				.limit(limit)
				//* secondly map through the animes and limit the quotes per anime
				.populate({
					path: 'quotes',
					options: { limit: quotes },
				});

			if (!animeList || animeList.length === 0) {
				new AnimeThrowError('empty', 'anime', 'notFound').throwError();
				return [];
			}

			return animeList;
		} catch (error: unknown) {
			// if it's a cast error (invalid ObjectId, etc.)
			new AnimeThrowError(
				'findAll',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return [];
		}
	}

	async getAnimeById(id: string, quotes: number = 5): Promise<AnimeDocument> {
		try {
			//* find the anime by id
			const anime = await this.animeModel
				.findOne({ _id: id })
				//* the anime has quotes, slice them with the quotes limit
				.populate({
					path: 'quotes',
					options: { limit: quotes },
				});

			//* if not found, throw error
			if (!anime) {
				new AnimeThrowError(
					'notFound',
					'anime',
					'notFound',
				).throwError();
				return undefined as never;
			}

			return anime;
		} catch (error: unknown) {
			new AnimeThrowError(
				'notFound',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async getQuoteById(id: string): Promise<QuoteDocument> {
		try {
			//* first get the anime by id
			const quote = await this.quoteModel.findOne({ _id: id });

			//* if not found, throw error
			if (!quote) {
				new AnimeThrowError(
					'notFound',
					'quote',
					'notFound',
				).throwError();
				return undefined as never;
			}

			return quote;
		} catch (error: unknown) {
			new AnimeThrowError(
				'notFound',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async createAnime(createAnimeDto: CreateAnimeDto): Promise<AnimeDocument> {
		try {
			//* create new anime object
			const newAnime = await this.animeModel.create({
				title: createAnimeDto.title,
				protagonist: createAnimeDto.protagonist,
				universe: createAnimeDto.universe,
			});

			if (!newAnime) {
				new AnimeThrowError('create', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			return newAnime;
		} catch (error: unknown) {
			new AnimeThrowError(
				'create',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async createQuote(
		animeId: string,
		createQuoteDto: CreateQuoteDto,
	): Promise<QuoteDocument> {
		try {
			//* first get the anime by id
			//* create new quote object
			const newQuote = await this.quoteModel.create({
				animeId: animeId,
				character: createQuoteDto.character,
				quote: createQuoteDto.quote,
				mood: createQuoteDto.mood,
				powerLevel: createQuoteDto.powerLevel
					? createQuoteDto.powerLevel
					: 0,
			});

			//* add the new quote to the anime quotes
			await this.animeModel.updateOne(
				{ _id: animeId },
				{ $push: { quotes: newQuote._id } },
			);

			if (!newQuote) {
				new AnimeThrowError('create', 'quote', 'notFound').throwError();
				return undefined as never;
			}

			return newQuote;
		} catch (error: unknown) {
			new AnimeThrowError(
				'create',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async updateQuote(
		id: string,
		updateQuoteDto: UpdateQuoteDto,
	): Promise<QuoteDocument> {
		try {
			//* first get the quote by id
			const updatedQuote = await this.quoteModel.findByIdAndUpdate(
				//? if the anime has quotes, find the quote by id and update it
				id,
				//* update the quote object with the new values
				// if the quote is found, update it
				{
					character: updateQuoteDto?.character,
					quote: updateQuoteDto?.quote,
					mood: updateQuoteDto?.mood,
					powerLevel: updateQuoteDto?.powerLevel,
				},
				{ new: true },
			);

			//? if the quote is not found, throw error
			if (!updatedQuote) {
				new AnimeThrowError('update', 'quote', 'notFound').throwError();
				return undefined as never;
			}

			return updatedQuote;
		} catch (error: unknown) {
			new AnimeThrowError(
				'update',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async updateAnime(
		id: string,
		updateAnimeDto: UpdateAnimeDto,
		quotes: number,
	): Promise<AnimeDocument> {
		try {
			//* check if the anime is in the DB first
			if (updateAnimeDto.title) {
				const exists = await this.animeModel
					.findOne({ title: updateAnimeDto.title })
					.collation({ locale: 'en', strength: 2 });

				if (exists) {
					new AnimeThrowError(
						'update',
						'anime',
						'conflict',
						`Anime with title "${updateAnimeDto.title}" already exists. Choose another epic name!`,
					).throwError();
					return undefined as never;
				}
			}

			const updatedAnime = await this.animeModel
				.findByIdAndUpdate(
					id,
					{
						title: updateAnimeDto?.title,
						protagonist: updateAnimeDto?.protagonist,
						universe: updateAnimeDto?.universe,
					},
					{ new: true },
				)
				.populate({
					path: 'quotes',
					options: { limit: quotes },
				});

			//? if there is a not found throw error
			if (!updatedAnime) {
				new AnimeThrowError('update', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			return updatedAnime;
		} catch (error: unknown) {
			new AnimeThrowError(
				'update',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async deleteAnime(id: string): Promise<DeleteResult> {
		try {
			const deletedAnime = await this.animeModel.deleteOne({ _id: id });

			if (!deletedAnime) {
				new AnimeThrowError('delete', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			return deletedAnime;
		} catch (error: unknown) {
			new AnimeThrowError(
				'delete',
				'anime',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}

	async deleteQuote(id: string): Promise<DeleteResult> {
		try {
			//* first get the quote by id
			const deletedQuote = await this.quoteModel.deleteOne({ _id: id });

			if (!deletedQuote) {
				new AnimeThrowError('delete', 'anime', 'notFound').throwError();
				return undefined as never;
			}

			//* return DeleteResult
			return deletedQuote;
		} catch (error: unknown) {
			new AnimeThrowError(
				'delete',
				'quote',
				'InternalServer',
				error,
			).throwError();
			return undefined as never;
		}
	}
}
