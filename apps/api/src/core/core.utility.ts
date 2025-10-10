import { ValidationError } from 'class-validator';

interface IFilterError {
	routes: string[]; // unmatched routes
	notFound: string[]; // not found error
	InternalServer: string[]; //  unexpected internal errors
	unknown: string[]; // Fallback for truly unknown exceptions
	conflict?: string[];
	forbidden?: string[];
	unauthorized?: string[];
}

type TStatusHits = {
	message: string;
	status: string;
};

//* that all the category that cover by the error messages and status hits
export interface ModuleRelations {
	anime: 'anime' | 'quote';
	movies: 'movies' | 'characters';
	songs: 'songs';
	series: 'series' | 'characters';
	books: 'books' | 'quote' | 'characters';
	characters: 'characters';
}

export type TModules = keyof ModuleRelations;

export type ModuleCategory<M extends TModules> = ModuleRelations[M];

//* that all the category of the errors that have error massage
export type TFilterErrorKeys = keyof IFilterError;

export interface IErrorMessage<M extends TModules> {
	notFound: Record<ModuleCategory<M>, string[]>;
	empty: Record<ModuleCategory<M>, string[]>;
	create: Record<ModuleCategory<M>, string[]>;
	update: Record<ModuleCategory<M>, string[]>;
	delete: Record<ModuleCategory<M>, string[]>;
	findAll?: Record<ModuleCategory<M>, string[]>;
}

type TStatusHitsByCategory = Record<TModules, TStatusHits[]>;

type TStatusHitsMap = Record<number, TStatusHitsByCategory>;
type TFilterMap = Record<TModules, IFilterError>;

export const ENTERTAIN_ERRORS: TFilterMap = {
	movies: {
		routes: [
			"This route's missing like a deleted movie scene.",
			'Wrong turn — even the GPS gave up on this route.',
			'Plot twist: this endpoint doesn’t exist.',
			"You tried to access the director’s cut. It's not released yet!",
			'404: The credits rolled before you got here.',
		],
		notFound: [
			"The movie you're looking for got lost in post-production.",
			'Even IMDb doesn’t know this one.',
			'That title’s more mysterious than ‘Inception.’',
			'Error 404: Vanished faster than a Marvel spoiler.',
			'We checked the archives — it’s not canon.',
		],
		InternalServer: [
			'The film reel burned mid-screening.',
			"Popcorn machine exploded. Server's having a meltdown.",
			'Our projectionist fell asleep again.',
			"The server's on a dramatic cliffhanger.",
			'Cue the suspense music... something broke.',
		],
		unknown: [
			'Unknown error: possibly written by David Lynch.',
			'The Matrix glitched again.',
			'We don’t even know what went wrong, but it was cinematic.',
			'This one’s straight from the director’s nightmares.',
			'That error was so random it deserves an Oscar.',
		],
	},

	anime: {
		routes: [
			'You tried to access a filler episode.',
			'404: Route vanished after the time skip.',
			'The power of friendship couldn’t find this endpoint.',
			'This route’s chakra ran out.',
			'Your query got isekai’d to another world.',
		],
		notFound: [
			'That anime’s been discontinued (RIP).',
			'Even the main character couldn’t find this.',
			'404: Senpai didn’t notice this resource.',
			'Gone like your favorite side character.',
			'Not found. Must’ve been a Genjutsu.',
		],
		InternalServer: [
			'The server went Super Saiyan... and crashed.',
			'A wild error appeared!',
			'Internal Server Jutsu failed miserably.',
			'Too much power level — system couldn’t handle it.',
			'Error arc: filler episode detected.',
		],
		unknown: [
			'Even the author didn’t write this one.',
			'That bug has no known power level.',
			'Unknown error: blame the studio.',
			'Our system just pulled a plot twist.',
			'This error’s been sealed by a forbidden technique.',
		],
	},

	songs: {
		routes: [
			'This route dropped off the charts.',
			'404: Can’t find the rhythm here.',
			'You’re singing off-key, wrong endpoint.',
			'This URL skipped like a scratched CD.',
			'Auto-tune couldn’t fix this route.',
		],
		notFound: [
			'That song faded out before it began.',
			'The lyrics mention you... but not this route.',
			'404: Lost in the remix.',
			'That track’s only available in the deluxe edition.',
			'We tried to hum it — no luck.',
		],
		InternalServer: [
			'Server hit a bad note.',
			'Mic check... 1, 2... nope, crashed.',
			'Internal server remix (not the good kind).',
			'DJ Error spinning unexpected beats.',
			'Server’s bass dropped — and didn’t come back.',
		],
		unknown: [
			'That error went platinum in chaos.',
			'Unreleased track: ‘Error in C Major.’',
			'Something off-key just happened.',
			'Server’s vibing too hard to respond.',
			'We lost the beat. Unknown glitch.',
		],
	},

	series: {
		routes: [
			'This route got canceled after season one.',
			'404: Lost between episodes.',
			'Wrong URL — it’s in another timeline.',
			'The writers forgot to include this one.',
			'Not even Netflix picked this route up.',
		],
		notFound: [
			'That show’s been pulled from streaming.',
			'404: Season finale missing.',
			'Couldn’t find it — maybe check the spin-off?',
			'This one’s stuck in production hell.',
			'Episode not found. Probably a filler.',
		],
		InternalServer: [
			'Server had a shocking season finale.',
			'Writers’ room caught on fire again.',
			'Error 500: Plot hole detected.',
			'Too many cliffhangers. System overloaded.',
			'Server rebooting between seasons.',
		],
		unknown: [
			'This glitch was left on a mid-season cliffhanger.',
			'Unknown error — maybe it’s a teaser for next season.',
			'The plot twist even surprised our backend.',
			'That error wasn’t in the script.',
			'We’ll resolve this next season (probably).',
		],
	},

	books: {
		routes: [
			'Wrong page — try flipping back a chapter.',
			'404: Page torn out of the story.',
			'You’ve wandered out of the plot.',
			'This URL fell off the bookshelf.',
			'The author forgot to write this part.',
		],
		notFound: [
			'That book’s out of print.',
			'404: Chapter missing — maybe stolen by pirates.',
			'Even the librarian couldn’t find it.',
			'This title vanished like a plot hole.',
			'Book not found. Maybe check the appendix?',
		],
		InternalServer: [
			'Ink spilled all over the code.',
			'The plot thickened too much — system crashed.',
			'Server lost its bookmark.',
			'Error 500: Writer’s block detected.',
			'Library closed due to unexpected errors.',
		],
		unknown: [
			'The ending was... confusing. So is this error.',
			'This one’s not in the index.',
			'The author refused to explain this bug.',
			'Mysterious forces corrupted the narrative.',
			'Unknown error: unfinished manuscript.',
		],
	},

	characters: {
		routes: [
			'Character development went missing here.',
			'404: Power level too low to access this route.',
			'Even the protagonist couldn’t find this endpoint.',
			'The villain deleted this URL.',
			'This path got caught in a flashback.',
		],
		notFound: [
			'That character’s been written out of the script.',
			'404: They didn’t survive the last arc.',
			'The fandom forgot who that is.',
			'Character not found — check the spin-off.',
			'Disappeared during the time skip.',
		],
		InternalServer: [
			'The character arc crashed mid-transformation.',
			'Server caught feelings — and crashed.',
			'Emotional overload. Try again later.',
			'Too many stats. The system fainted.',
			'Our hero faced an unexpected error boss fight.',
		],
		unknown: [
			'This bug transcended reality.',
			'Error so rare, it’s now a legendary character.',
			'Unknown glitch joined the party.',
			'We rolled a 1 on the debugging check.',
			'That wasn’t supposed to happen... canonically.',
		],
	},
};

export const STATUS_HITS: TStatusHitsMap = {
	200: {
		movies: [
			{
				message: 'Roll credits — everything worked!',
				status: 'BLOCKBUSTER',
			},
		],
		anime: [
			{ message: 'All systems go! Believe it!', status: 'SUPER_SAIYAN' },
		],
		songs: [{ message: 'Everything’s on beat.', status: 'PLATINUM_TRACK' }],
		series: [{ message: 'Another successful season!', status: 'RENEWED' }],
		books: [{ message: 'The plot checks out.', status: 'BEST_SELLER' }],
		characters: [
			{
				message: 'Main character energy detected.',
				status: 'PROTAGONIST_MODE',
			},
		],
	},

	201: {
		movies: [{ message: 'Sequel confirmed!', status: 'COMING_SOON' }],
		anime: [{ message: 'New arc unlocked!', status: 'NEXT_SEASON' }],
		songs: [
			{ message: 'Fresh drop — chart incoming!', status: 'HIT_SINGLE' },
		],
		series: [{ message: 'Another episode in the bag!', status: 'FILMED' }],
		books: [{ message: 'New chapter written.', status: 'PAGE_TURNER' }],
		characters: [
			{ message: 'Character development achieved!', status: 'LEVEL_UP' },
		],
	},

	400: {
		movies: [
			{
				message: 'Bad take detected — reshoot required!',
				status: 'BAD_SCRIPT',
			},
		],
		anime: [{ message: 'Plot hole no jutsu!', status: 'BAD_REQUEST' }],
		songs: [
			{ message: 'Off-beat! Try tuning again.', status: 'OUT_OF_RHYTHM' },
		],
		series: [
			{ message: 'That plot twist didn’t land.', status: 'FLOP_EPISODE' },
		],
		books: [
			{
				message: 'Grammar monster strikes again.',
				status: 'TYPO_ATTACK',
			},
		],
		characters: [
			{ message: 'NPC tried to main character.', status: 'WRONG_ROLE' },
		],
	},

	404: {
		movies: [
			{
				message: 'Scene missing — check the cutting room floor.',
				status: 'LOST_REEL',
			},
		],
		anime: [
			{
				message: 'Not Found! Like your favorite anime’s next season.',
				status: 'FILLER_VOID',
			},
		],
		songs: [
			{
				message: 'Lyrics not found. Must be freestyle.',
				status: 'MUTE_MODE',
			},
		],
		series: [
			{
				message: 'Episode not found. Probably cancelled.',
				status: 'DELAYED_SEASON',
			},
		],
		books: [
			{
				message: 'Page not found. Maybe torn out?',
				status: 'MISSING_PAGE',
			},
		],
		characters: [
			{
				message: 'Character not found — plot armor failed.',
				status: 'DISAPPEARED',
			},
		],
	},

	418: {
		movies: [
			{
				message: 'I’m a teapot — and proud of it!',
				status: 'BREWING_MODE',
			},
		],
		anime: [
			{
				message: 'Character transformed… into a teapot.',
				status: 'CHA_NO_JUTSU',
			},
		],
		songs: [
			{
				message: 'Singing while steeping. Tea time vibes.',
				status: 'TEA_TRACK',
			},
		],
		series: [
			{
				message: 'Unexpected spin-off: The Teapot Chronicles.',
				status: 'UNFILTERED_EPISODE',
			},
		],
		books: [
			{
				message: 'Plot brewed too long — now it’s tea.',
				status: 'LEAFY_CHAPTER',
			},
		],
		characters: [
			{ message: 'Side quest: find sugar and milk.', status: 'TEA_ARC' },
		],
	},

	500: {
		movies: [
			{
				message: 'Director rage-quit mid-edit.',
				status: 'PRODUCTION_MELTDOWN',
			},
		],
		anime: [
			{
				message: 'Internal Server Error — the backend just rage quit.',
				status: 'SYSTEM_OVERLOAD',
			},
		],
		songs: [
			{
				message: 'Studio crashed — autotune overloaded.',
				status: 'AUDIO_GLITCH',
			},
		],
		series: [
			{
				message: 'Writers’ strike! Script lost.',
				status: 'SCRIPT_ERROR',
			},
		],
		books: [
			{
				message: 'Author spilled coffee on manuscript.',
				status: 'INK_ERROR',
			},
		],
		characters: [
			{ message: 'Character existential crisis.', status: 'BROKEN_ARC' },
		],
	},

	502: {
		movies: [
			{
				message: 'Bad Gateway! The film reel got jammed.',
				status: 'REEL_GLITCH',
			},
		],
		anime: [
			{
				message: 'Bad Gateway! Someone unplugged the mecha.',
				status: 'MECHA_DISCONNECT',
			},
		],
		songs: [
			{
				message: 'Sound engineer fell asleep on the job.',
				status: 'SILENCE_MODE',
			},
		],
		series: [
			{
				message: 'Transmission interrupted by space pirates.',
				status: 'SIGNAL_LOST',
			},
		],
		books: [
			{
				message: 'Pages out of order. Blame the printer.',
				status: 'PUBLISH_FAIL',
			},
		],
		characters: [
			{
				message: 'Transport portal malfunctioned.',
				status: 'TELEPORT_ERROR',
			},
		],
	},

	503: {
		movies: [
			{
				message: 'Service Unavailable — cast on vacation.',
				status: 'ON_BREAK',
			},
		],
		anime: [
			{
				message: 'Service Unavailable! Probably watching One Piece.',
				status: 'FILLER_HOLIDAY',
			},
		],
		songs: [
			{ message: 'Band’s on tour. Try later.', status: 'STAGE_CLOSED' },
		],
		series: [
			{
				message: 'Production paused for snacks.',
				status: 'MID_SEASON_BREAK',
			},
		],
		books: [
			{
				message: 'Author’s on a coffee break. Indefinitely.',
				status: 'WRITER_BLOCK',
			},
		],
		characters: [
			{ message: 'Character refused to respawn.', status: 'AFK_MODE' },
		],
	},
};

export const ROUTE_NOT_FOUND_MESSAGES: Record<TModules, string[]> = {
	anime: [
		'This anime route got lost in another dimension. Probably waiting for season 2.',
		'404: This route got Isekai’d into a better API.',
		'Anime route not found. Maybe the author went on hiatus again.',
		'This anime endpoint vanished faster than the animation budget after episode 3.',
	],

	movies: [
		'Scene missing. Maybe it got cut from the director’s edition.',
		'404: The sequel never got greenlit.',
		'This movie route disappeared in post-production.',
		'This endpoint flopped harder than Morbius on release day.',
	],

	songs: [
		'This route hit a flat note — track not found.',
		'404: Silence. Even the beat dropped out.',
		'This song route skipped itself like a scratched CD.',
		'The melody’s missing — must’ve been deleted from the playlist.',
	],

	series: [
		'This route got canceled after one season. Critics said “mid.”',
		'404: Episode never aired. Probably behind a paywall.',
		'This series route went on hiatus indefinitely.',
		'Missing route. Blame the network executives.',
	],

	books: [
		'Page not found. Maybe the author never finished this chapter.',
		'404: This book route fell out of canon.',
		'The librarian couldn’t find this one either.',
		'Route missing — probably left in the editor’s drafts.',
	],

	characters: [
		'Character route not found. Must’ve been written out in the rewrite.',
		'404: Background extra. Didn’t make it past episode one.',
		'Character route disappeared into the multiverse of plot holes.',
		'Missing route — looks like the fandom voted this one off the island.',
	],
};

export const ROUTE_NOT_FOUND_ERROR: Record<TModules | 'unknown', string[]> = {
	anime: [
		'Lost in the multiverse of shōnen nonsense.',
		'404 Chakra not found.',
		'The anime gods disapprove this route.',
		'Plot twist: the endpoint was filler all along.',
	],
	movies: [
		'Director cut the route from the script.',
		'404: Scene deleted.',
		'Plot hole detected — route missing.',
		'Production wrapped without this one.',
	],
	songs: [
		'Melody missing — silence hits hard.',
		'404: Drop the beat? The beat dropped out.',
		'Audio file skipped itself.',
		'The chorus forgot its cue.',
	],
	series: [
		'Season finale never aired.',
		'404: Episode missing in action.',
		'This arc got canceled mid-cliffhanger.',
		'Route trapped in endless recap episodes.',
	],
	books: [
		'Chapter torn out by the editor.',
		'404: Page not found — literally.',
		'Author rage-quit mid-sentence.',
		'Book route lost in translation.',
	],
	characters: [
		'Character development not found.',
		'404: NPC deleted from the timeline.',
		'Route died in episode one.',
		'They vanished in the time skip.',
	],
	unknown: [
		'404: This route wandered off-screen.',
		'You’ve stepped into backend limbo.',
		'Plot hole detected — API vanished.',
		'The devs deny all knowledge of this dimension.',
	],
};

export interface IThrowError {
	message: string;
	error: string | object;
	errorType: TFilterErrorKeys;
	module: TModules;
	timestamp: Date;
}

export interface IErrorResponse
	extends Omit<IThrowError, 'errorType' | 'module'> {
	hit: TStatusHits[];
	funFact: string;
}

export type TValidationDetails = {
	field: string;
	errors: string[];
	suggestion: string;
};

export interface IValidationResponse {
	message: string;
	details: TValidationDetails[];
}

export const getFunError = (
	moduleKey: TModules,
	errorTypeKey: TFilterErrorKeys,
	status: number,
	throwErrorResponse: Partial<IThrowError>,
): IErrorResponse => {
	const funFacts = ENTERTAIN_ERRORS[moduleKey]?.[errorTypeKey] ?? [
		'Even Goku takes a break sometimes...',
	];

	const funFact =
		funFacts[Math.floor(Math.random() * funFacts.length)] ??
		'No fun fact this time — plot twist!';

	const statusHit =
		STATUS_HITS[status]?.[moduleKey] ?? STATUS_HITS[500]['characters'];

	const errorResponse: IErrorResponse = {
		message: throwErrorResponse.message ?? 'Something went sideways...',
		error: throwErrorResponse.error ?? 'Unknown error',
		hit: statusHit,
		funFact,
		timestamp: throwErrorResponse.timestamp || new Date(),
	};

	return errorResponse;
};

export interface ValidationExceptionResponse {
	message: string | string[];
	errors?: ValidationError[];
}
