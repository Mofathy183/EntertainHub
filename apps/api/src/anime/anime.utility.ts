import type { IErrorMessage, ModuleCategory } from 'core/index';
import { IAnime, IDelete, IQuote } from './anime.dto';
import { AnimeDocument, QuoteDocument } from './anime.schema';
import { DeleteResult } from 'mongoose';

export class AnimeMapper {
	static toQuoteDTO(quote: QuoteDocument): IQuote {
		return {
			_id: quote._id,
			animeId:
				typeof quote.animeId === 'string' ? quote.animeId : undefined,
			character: quote.character,
			quote: quote.quote,
			mood: quote.mood,
			powerLevel: quote.powerLevel,
		};
	}

	static toAnimeDTO(anime: AnimeDocument): IAnime {
		return {
			_id: anime._id,
			title: anime.title,
			protagonist: anime.protagonist,
			universe: anime.universe || undefined,
			quotes: Array.isArray(anime.quotes)
				? (anime.quotes as QuoteDocument[]).map((q) =>
						this.toQuoteDTO(q),
					)
				: [],
		};
	}

	static toDelete(id: string, result: DeleteResult): IDelete {
		return {
			_id: id,
			isDeleted: result.acknowledged,
			count: result.deletedCount,
		};
	}
}

export const toTitleCase = (val: string) => {
	if (!val) return val;

	return val.length <= 4
		? val.toUpperCase()
		: val
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
};

//* NotFOundException messages list
export const ErrorMessages: IErrorMessage<'anime'> = {
	notFound: {
		anime: [
			'Anime with that ID not found. Did it get Isekai’d into another database?',
			'Anime with that ID vanished faster than Goku instant-transmission.',
			'Anime with that ID not found. Must’ve been filler and got cut.',
			'Anime with that ID is missing… maybe it’s waiting for the next season.',
		],
		quote: [
			'Quote with that ID not found. Probably Yamcha’d out of existence.',
			'Quote with that ID pulled a Naruto — ran away and never came back.',
			'Quote with that ID disappeared like Attack on Titan’s walls.',
			'Quote with that ID got sealed away. Try summoning it with a 5-star ritual.',
		],
	},

	empty: {
		anime: [
			'No anime found. Guess we’re stuck in a filler arc.',
			'The anime list is emptier than Sakura’s relevance in early Naruto.',
			'No anime here. Did Thanos snap the database?',
			'Zero anime detected. Looks like Crunchyroll on maintenance day.',
		],
		quote: [
			'This anime has no quotes. Silent protagonist mode activated.',
			'No quotes here… even Shounen MCs talk more than this.',
			'Empty quotes list. Must be stuck in a training arc.',
			'Not a single quote. It’s quieter than a Death Note page without names.',
		],
	},

	create: {
		anime: [
			'Failed to create anime. Maybe the author went on hiatus like Togashi.',
			'Anime creation failed. Did your pen run out of chakra ink?',
			'Could not add anime. Feels like a cancelled anime after episode 1.',
			'Anime not created. Probably rejected by Shounen Jump.',
		],
		quote: [
			'Failed to create quote. The character refused to talk.',
			'Quote creation failed. Even Pikachu says “Pika Pika” more than this.',
			'Could not add quote. Must’ve gotten lost in translation.',
			'Quote not created. Looks like the VA didn’t show up.',
		],
	},

	update: {
		anime: [
			'Failed to update anime. Studio switched mid-season, huh?',
			'Anime update failed. Must’ve hit the dreaded recap episode.',
			'Could not update anime. The plot armor wasn’t strong enough.',
			'Anime not updated. Guess it’s waiting for the director’s cut.',
		],
		quote: [
			'Failed to update quote. The character went AFK in another arc.',
			'Quote update failed. Someone skipped the dialogue box.',
			'Could not update quote. Looks like the script got rewritten.',
			'Quote not updated. Even filler arcs have better continuity.',
		],
	},

	delete: {
		anime: [
			'Failed to delete anime. It pulled a JoJo and shouted “Yare Yare Daze.”',
			'Anime deletion failed. Looks like the protagonist used plot armor.',
			'Could not delete anime. The fandom wouldn’t allow it.',
			'Anime not deleted. Must’ve gone into rerun mode instead.',
		],
		quote: [
			'Failed to delete quote. It clung on harder than Naruto to Sasuke.',
			'Quote deletion failed. Someone shouted “This is my ninja way!”',
			'Could not delete quote. It hid in the shadows like a true shinobi.',
			'Quote not deleted. Looks like it triggered a flashback sequence.',
		],
	},

	findAll: {
		anime: [
			'Error fetching anime list. Did the database fall into the void like Kon?',
			'Could not retrieve anime. Feels like waiting for the next One Piece episode.',
			'Failed to load anime. Studio MAPPA is probably overworked again.',
			'Anime fetch failed. Guess we’re stuck in the loading screen forever.',
		],
		quote: [
			'Error fetching quotes. Even Gintoki talks more than this DB right now.',
			'Failed to load quotes. Someone paused the episode mid-sentence.',
			'Could not retrieve quotes. The subtitles didn’t load.',
			'Quotes fetch failed. Maybe it was censored in the broadcast version.',
		],
	},
};

export type AnimeErrorType = keyof IErrorMessage<'anime'>;
export type AnimeErrorCategory = ModuleCategory<'anime'>;

//* get random message from array
export const getAnimeErrorMessage = (
	type: AnimeErrorType,
	category: AnimeErrorCategory,
): string => {
	const moduleErrors = ErrorMessages[type];
	const messages = moduleErrors?.[category];

	if (!messages) {
		throw new Error(`No error messages found for ${type}.${category}`);
	}

	return messages[Math.floor(Math.random() * messages.length)];
};
