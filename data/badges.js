const { assetUrl } = require('./assetUrl');

// The 10 built-in badges. Images live in kansha-fe/public/badges/.
const BADGES = [
	['over_achiever', 'over-achiever'],
	['problem_solver', 'problem-solver'],
	['team_leader', 'team-leader'],
	['mvp', 'mvp'],
	['helping_hand', 'helping-hand'],
	['all_day', 'all-day-everyday'],
	['jupiter', 'jupiter'],
	['class_clown', 'class-clown'],
	['high_five', 'high-five'],
	['jedi_master', 'jedi-master'],
];

const badgeRows = () =>
	BADGES.map(([badge_name, file], i) => ({
		id: i + 1,
		badge_name,
		badge_URL: assetUrl(`badges/${file}.svg`),
	}));

module.exports = { badgeRows };
