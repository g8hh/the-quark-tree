let modInfo = {
	name: "夸克树 - The Quark Tree",
	id: "quarktree",
	author: "辉影神秘",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.121",
	name: "夸克碎片化",
}

let changelog = `<h1>更新日志(上次更新:2021/12/5):</h1><br>
	<h3>v0.121 夸克碎片化</h3><br>
	<li>修复一开始无法获得宇宙泡沫的bug<br>
	<h3>v0.12</h3><br>
	<li>增加'无泡沫'挑战全效果<br>
	<li>增强碎片阶段3~4<br>
	<li>增加完整性,虽然它还没有任何用<br>
	<li>现在残局是: 66总夸克<br>
	<h3>v0.11</h3><br>
	<li>碎片二阶完善,游戏进程推到泡沫挑战并平衡<br>
	<li>调整颜色<br>
	<li>现在残局是: 45总夸克<br>
	<h3>v0.1</h3><br>
	<li>增加夸克,宇宙泡沫,增强器,碎片及对应功能<br>
	<li>现在残局是: 25总夸克
	`

let winText = `请不要继续游戏!我很快会更新!!!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return false
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"当前残局: 66总夸克"
]

// Determines when the game "ends"
function isEndgame() {
	return player.qu.goals[0].gte(new Decimal("66"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}