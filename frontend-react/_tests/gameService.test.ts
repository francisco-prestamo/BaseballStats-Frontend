import { Game } from "../src/models/Game"
import { fetchGameDetails } from "../src/services/users/all/gameService"

describe('Example testing suite', () => {
  test('using fetchGames should work', async () => {
    let game: Game

    game = await(fetchGameDetails('25'))


    expect(game.id).toBe(25);
  })

  test('simple example test', () => {
    expect(1).toBe(1);
    expect(1).not.toBe(null);
  })
})