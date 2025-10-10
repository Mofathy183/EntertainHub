import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isCuid } from '@paralleldrive/cuid2';
import type { TModules } from './index';

export type TCuidError = {
	wisdom: string;
	code: string;
	hint: string;
};

const AnimeCuidErrors: TCuidError[] = [
	{
		wisdom: 'That ID doesn’t exist — maybe it got Isekai’d into another universe.',
		code: 'INVALID_ID_ANIME',
		hint: 'Try again before the opening song restarts.',
	},
	{
		wisdom: 'This ID’s missing. Probably training for the next arc.',
		code: 'INVALID_ID_ANIME',
		hint: 'Check your form before powering up again.',
	},
	{
		wisdom: 'That doesn’t look right. Even the sensei couldn’t identify it.',
		code: 'INVALID_ID_ANIME',
		hint: 'Breathe in, focus your chakra, and re-enter the correct ID.',
	},
	{
		wisdom: 'This ID vanished faster than a side character in episode one.',
		code: 'INVALID_ID_ANIME',
		hint: 'Try summoning it again with true protagonist energy.',
	},
	{
		wisdom: 'Not valid. Someone probably rewrote the script mid-battle.',
		code: 'INVALID_ID_ANIME',
		hint: 'Double-check before the next transformation sequence.',
	},
];

const MovieCuidErrors: TCuidError[] = [
	{
		wisdom: 'That ID didn’t make the final cut. Director’s orders.',
		code: 'INVALID_ID_MOVIE',
		hint: 'Reshoot the scene with the right one.',
	},
	{
		wisdom: 'Invalid ID — even the credits forgot to roll it.',
		code: 'INVALID_ID_MOVIE',
		hint: 'Find the proper version before the sequel drops.',
	},
	{
		wisdom: 'This ID’s more confusing than a time-travel plot.',
		code: 'INVALID_ID_MOVIE',
		hint: 'Stick to one timeline — and one valid ID.',
	},
	{
		wisdom: 'That ID flopped harder than a bad reboot.',
		code: 'INVALID_ID_MOVIE',
		hint: 'Try again — this time with better writing.',
	},
	{
		wisdom: 'Invalid ID. Even CGI couldn’t save that one.',
		code: 'INVALID_ID_MOVIE',
		hint: 'Roll the camera again with the right take.',
	},
];

const SongCuidErrors: TCuidError[] = [
	{
		wisdom: 'That ID’s offbeat. Even the rhythm section stopped playing.',
		code: 'INVALID_ID_SONG',
		hint: 'Try again before the chorus hits.',
	},
	{
		wisdom: 'Invalid ID — sounds like someone forgot the lyrics.',
		code: 'INVALID_ID_SONG',
		hint: 'Check the notes before dropping your next line.',
	},
	{
		wisdom: 'That doesn’t sound right. The tune’s out of sync.',
		code: 'INVALID_ID_SONG',
		hint: 'Rewind and play it again — in key this time.',
	},
	{
		wisdom: 'This ID missed the beat completely.',
		code: 'INVALID_ID_SONG',
		hint: 'Drop a fresh one before the crowd leaves.',
	},
	{
		wisdom: 'Invalid track — the DJ said ‘no requests for that.’',
		code: 'INVALID_ID_SONG',
		hint: 'Spin up the right ID and vibe on.',
	},
];

const SeriesCuidErrors: TCuidError[] = [
	{
		wisdom: 'That ID was cancelled mid-season.',
		code: 'INVALID_ID_SERIES',
		hint: 'Renew it with the right one before the finale.',
	},
	{
		wisdom: 'Invalid ID. It ended on a cliffhanger no one understood.',
		code: 'INVALID_ID_SERIES',
		hint: 'Start a new episode with a valid one.',
	},
	{
		wisdom: 'That doesn’t belong here. Even the writers forgot this plotline.',
		code: 'INVALID_ID_SERIES',
		hint: 'Stick to the main story — and a correct ID.',
	},
	{
		wisdom: 'This ID’s pacing is all wrong — filler detected.',
		code: 'INVALID_ID_SERIES',
		hint: 'Skip the filler and rewatch with a valid entry.',
	},
	{
		wisdom: 'Not valid. The show got rebooted without it.',
		code: 'INVALID_ID_SERIES',
		hint: 'Catch the new version — the one that makes sense.',
	},
];

const BookCuidErrors: TCuidError[] = [
	{
		wisdom: 'That ID fell out between the pages.',
		code: 'INVALID_ID_BOOK',
		hint: 'Flip back and try a proper one.',
	},
	{
		wisdom: 'Invalid ID — the author must’ve cut it in the final draft.',
		code: 'INVALID_ID_BOOK',
		hint: 'Proofread your entry before publishing again.',
	},
	{
		wisdom: 'That ID belongs in the fantasy section — of someone else’s story.',
		code: 'INVALID_ID_BOOK',
		hint: 'Find the real one before the next chapter.',
	},
	{
		wisdom: 'This ID’s so wrong it’d make a librarian sigh.',
		code: 'INVALID_ID_BOOK',
		hint: 'Dust off the right reference next time.',
	},
	{
		wisdom: 'That ID was a plot twist no one asked for.',
		code: 'INVALID_ID_BOOK',
		hint: 'Rewrite it — with better logic and a valid entry.',
	},
];

const CharacterCuidErrors: TCuidError[] = [
	{
		wisdom: 'That ID doesn’t exist. Probably got written out of the script.',
		code: 'INVALID_ID_CHARACTER',
		hint: 'Bring them back with a real one before the next act.',
	},
	{
		wisdom: 'Invalid character ID — they’re stuck in a flashback again.',
		code: 'INVALID_ID_CHARACTER',
		hint: 'Pull them out with a better plot device.',
	},
	{
		wisdom: 'This ID’s faker than a hero’s sudden power-up.',
		code: 'INVALID_ID_CHARACTER',
		hint: 'Give them a believable backstory — and a valid ID.',
	},
	{
		wisdom: 'That character vanished faster than your favorite sidekick.',
		code: 'INVALID_ID_CHARACTER',
		hint: 'Call them back with something real.',
	},
	{
		wisdom: 'Invalid ID. Even the narrator forgot their name.',
		code: 'INVALID_ID_CHARACTER',
		hint: 'Remind the story who they are — correctly this time.',
	},
];

const CUID_ERROR: Record<TModules, TCuidError[]> = {
	anime: AnimeCuidErrors,
	movies: MovieCuidErrors,
	songs: SongCuidErrors,
	series: SeriesCuidErrors,
	books: BookCuidErrors,
	characters: CharacterCuidErrors,
};

@Injectable()
export class CuidValidationPipe implements PipeTransform {
	private cuidError: TCuidError;

	constructor(private readonly moduleName: TModules) {
		const errors = CUID_ERROR[moduleName];
		this.cuidError = errors[Math.floor(Math.random() * errors.length)]; // und
	}
	transform(id: string): string {
		if (!id || typeof id !== 'string') {
			throw new BadRequestException({
				message:
					'That ID looks emptier than the plot of a bad filler episode — at least send *something*, hero.',
				error: this.cuidError,
			});
		}

		if (id.length !== 24 || /^\d+$/.test(id)) {
			throw new BadRequestException({
				message:
					'This ID’s shape makes no sense — like a movie sequel written by the intern on night shift.',
				error: this.cuidError,
			});
		}

		if (!isCuid(id)) {
			throw new BadRequestException({
				message:
					'Nice try, but that ID’s faker than a power-up scene with zero training arc.',
				error: this.cuidError,
			});
		}

		return id;
	}
}
