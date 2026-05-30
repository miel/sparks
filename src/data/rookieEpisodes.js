// The Rookie seizoenen en afleveringen
export const seasons = [
  { season: 1, episodes: 20 },
  { season: 2, episodes: 20 },
  { season: 3, episodes: 14 },
  { season: 4, episodes: 22 },
  { season: 5, episodes: 22 },
  { season: 6, episodes: 13 },
]

export function getEpisodeId(season, episode) {
  return `s${season}e${episode}`
}
