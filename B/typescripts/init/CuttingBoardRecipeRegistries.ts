import { MinecraftDimensionTypes, Scoreboard, ScoreboardObjective, system, world } from "@minecraft/server";
import { methodEventSub } from "../lib/eventHelper";
import { BlockofAxeList, BlockofKnifeList, BlockofPickaxeList, BlockofShovelList, ItemofAxeList, ItemofKnifeList, ItemofPickaxeList, ItemofShearsList } from "../data/recipe/cuttingBoardRecipe";

const scoreboard: Scoreboard = world.scoreboard;
let bool: boolean = true;
let num: number = 0;

export class CuttingBoardRegistries {
    public static initCuttingBoardScoRegistries() {
        system.runInterval(() => {
            const allSco: ScoreboardObjective[] | undefined = scoreboard.getObjectives();
            if (!allSco?.length || !bool) return;
            for (const sco of allSco) {
                const name: string = sco.displayName;
                const reg: RegExpMatchArray | null = name.match(/farmersdelight_(\w+)/);
                if (reg) {
                    world.getDimension(MinecraftDimensionTypes.overworld).runCommandAsync(`function farmersdelight/cutting_board_recipe_registries/${reg[1]}`);
                }
            }
            bool = false;
        })
    }
    @methodEventSub(system.afterEvents.scriptEventReceive, { namespaces: ["farmersdelight"] })
    registries(args: any) {
        const id: string = args.id;
        if (id != "farmersdelight:cutting_board_recipe") return;
        const message: string = args.message;
        try {
            if( message.includes("?")&&(message.split("?").length==2)){
                const recipeType = message.split("?")[1]
                if(recipeType=="ItemofPickaxeList"){
                    ItemofPickaxeList.unshift(message.split("?")[0])
                    num++;
                }
                if(recipeType=="ItemofAxeList"){
                    ItemofAxeList.unshift(message.split("?")[0])
                    num++;
                }
                if(recipeType=="ItemofShearsList"){
                    ItemofShearsList.unshift(message.split("?")[0])
                    num++;
                }
                if(recipeType=="BlockofAxeList"){
                    BlockofAxeList.unshift(message.split("?")[0])
                    num++;
                }
                if(recipeType=="BlockofPickaxeList"){
                    BlockofPickaxeList.unshift(message.split("?")[0])
                    num++;
                }
                if(recipeType=="BlockofKnifeList"){
                    BlockofKnifeList.unshift(message.split("?")[0])
                    num++;
                }
                if(recipeType=="BlockofShovelList"){
                    BlockofShovelList.unshift(message.split("?")[0])
                    num++;
                }

            }
            else{
                ItemofKnifeList.unshift(message)
                num++;
            }
          
            console.warn(`已加载 §4${num}§f 个砧板配方`);
        } catch (error) {
            return;
        }
    }
}