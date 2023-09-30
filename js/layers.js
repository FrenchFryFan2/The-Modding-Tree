addLayer("r", {
    name: "rebirth", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#F279E0",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "rebirth points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('r', 12)) mult = mult.times(upgradeEffect('r', 12))
        if (hasUpgrade('r', 14)) mult = mult.times(1.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rebirth points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    passiveGeneration(){
        if (hasMilestone("a", 0)) return 0.1
    },
    doReset(){
        if (hasUpgrade("a", 13)) 
        layerDataReset("r", [upgrades])
    },
    upgrades: {
        11: {
            title: "Inflation!",
            description: "Doubles point gain.",
            cost: new Decimal(1),
        },
        12: {
            title: "Rich Get Richer",
            description: "Rebirth points boost their own gain.",
            cost: new Decimal(2),
            effect() {
                return player[this.layer].points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            title: "More Synergy",
            description: "Rebirth points boost point gain.",
            cost: new Decimal(6),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Money Making Machine",
            description: "Multiplies point and rebirth point gain by 1.5x.",
            cost: new Decimal(35),
        }
    },
})

addLayer("a", {
    name: "ascend", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#AAE9ED",
    requires: new Decimal(250), // Can be a function that takes requirement increases into account
    resource: "ascensions", // Name of prestige currency
    baseResource: "rebirth points", // Name of resource prestige is based on
    baseAmount() {return player.r.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.65, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Reset for ascensions", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Divine Intervention",
            description: "Ascensions boost point gain, even at 0.",
            cost: new Decimal(1),
            effect() {
                return player[this.layer].points.add(2).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
            },
        12: {
            title: "Money Multiplying Machine",
            description: "Multiply point gain by 2.",
            cost: new Decimal(2),
            },
        13: {
            title: "Back to Square Two",
            description: "Rebirth point upgrades no longer reset.",
            cost: new Decimal(3),
            },
    },

    milestones: {
        0: {
            requirementDescription: "2 Ascensions",
            effectDescription: "Automatically gain 10% rebirth point gain per second.",
            done() { return player[this.layer].points.gte(2) },
        }
    }
})