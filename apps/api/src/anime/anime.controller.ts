import {
	Controller,
	Get,
	Param,
	Query,
	Body,
	ParseIntPipe,
	DefaultValuePipe,
	Post,
	Patch,
	Delete,
} from '@nestjs/common';
import {
	IAnime,
	IQuote,
	IUpdateQuote,
	IDelete,
	UpdateAnimeDto,
	IUpdateAnime,
} from './anime.dto';
import { CreateAnimeDto, CreateQuoteDto, UpdateQuoteDto } from './anime.dto';
import { AnimeService } from './anime.service';
import { AnimeMapper } from './anime.utility';
import { CuidValidationPipe } from '../core/index';

//* the route endpoint for this controller
@Controller('anime') //* so any request to "/anime" will be handled by this controller
export class AnimeController {
	//* will add the controller methods here
	/**
	 * Constructor to inject the AnimeService
	 * @param animeService The AnimeService instance
	 *
	 * @Injectable() is a decorator that marks a class as a provider that can be injected as a dependency.
	 * In this case, it allows the AnimeService to be injected into the AnimeController.
	 *
	 * The AnimeService is responsible for handling the business logic related to anime and quotes,
	 * while the AnimeController handles incoming HTTP requests and delegates the work to the service.
	 *
	 * This separation of concerns helps keep the code organized and maintainable.
	 */

	//* injecting the AnimeService into the controller
	constructor(private readonly animeService: AnimeService) {}

	//* GET "/anime" get all amine with its quotes. PARAMS limit for the amine default 10, and quotes per anime default 5
	@Get()
	async fineAllAnime(
		@Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
		@Query('quotes', new DefaultValuePipe(5), ParseIntPipe) quotes: number,
	): Promise<IAnime[]> {
		const animes = this.animeService.getAllAnime(limit, quotes);
		return (await animes).map((anime) => AnimeMapper.toAnimeDTO(anime));
	}

	//* GET "/anime/:id" get anime by id will its quotes. quotes per anime default 5
	@Get(':id')
	async findAnimeById(
		@Param('id', new CuidValidationPipe('anime')) id: string,
		@Query('quotes', new DefaultValuePipe(5), ParseIntPipe) quotes: number,
	): Promise<IAnime> {
		const anime = await this.animeService.getAnimeById(id, quotes);
		return AnimeMapper.toAnimeDTO(anime);
	}

	//* GET "quote/:id" get quote by id
	@Get('quote/:id')
	async findQuotById(
		@Param('id', new CuidValidationPipe('anime')) id: string,
	): Promise<IQuote> {
		const quote = await this.animeService.getQuoteById(id);
		return AnimeMapper.toQuoteDTO(quote);
	}

	//* POST "/anime" create new anime
	@Post()
	async createAnime(@Body() createAnimeDto: CreateAnimeDto): Promise<IAnime> {
		const newAnime = await this.animeService.createAnime(createAnimeDto);
		return AnimeMapper.toAnimeDTO(newAnime);
	}

	//* POST "/anime/:id/quote" create new quote for anime by id
	@Post(':id/quote')
	async createQuot(
		@Param('id', new CuidValidationPipe('anime')) id: string,
		@Body() createQuoteDto: CreateQuoteDto,
	): Promise<IQuote> {
		const newQuote = await this.animeService.createQuote(
			id,
			createQuoteDto,
		);
		return AnimeMapper.toQuoteDTO(newQuote);
	}

	//* PATCH "/quote/:id" update quote by id
	@Patch('quote/:id')
	async updateQuot(
		@Param('id', new CuidValidationPipe('anime')) id: string,
		@Body() updateQuoteDto: UpdateQuoteDto,
	): Promise<IUpdateQuote> {
		const updatedQuote = await this.animeService.updateQuote(
			id,
			updateQuoteDto,
		);
		return AnimeMapper.toQuoteDTO(updatedQuote);
	}

	//* PATCH "/:id" update anime by id
	@Patch(':id')
	async updateAnime(
		@Param('id', new CuidValidationPipe('anime')) id: string,
		@Body() updateAnimeDto: UpdateAnimeDto,
		@Query('quotes', new DefaultValuePipe(5), ParseIntPipe) quotes: number,
	): Promise<IUpdateAnime> {
		const updatedAnime = await this.animeService.updateAnime(
			id,
			updateAnimeDto,
			quotes,
		);
		return AnimeMapper.toAnimeDTO(updatedAnime);
	}

	//* DELETE "/quote/:id" delete quote by id
	@Delete('quote/:id')
	async deleteQuote(
		@Param('id', new CuidValidationPipe('anime')) id: string,
	): Promise<IDelete> {
		const deletedQuote = await this.animeService.deleteQuote(id);
		return AnimeMapper.toDelete(id, deletedQuote);
	}

	//* DELETE "/:id" delete anime by id
	@Delete(':id')
	async deleteAnime(
		@Param('id', new CuidValidationPipe('anime')) id: string,
	): Promise<IDelete> {
		const deleteAnime = await this.animeService.deleteAnime(id);
		return AnimeMapper.toDelete(id, deleteAnime);
	}
}
