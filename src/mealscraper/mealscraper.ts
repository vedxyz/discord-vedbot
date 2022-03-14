import fetch, { Response } from "node-fetch";
import * as fs from "fs";
import { withFile } from "tmp-promise";
import { promisify } from "util";
import { exec } from "child_process";
import dayjs, { Dayjs } from "dayjs";
import path from "path";
import { projrootdir } from "../rootdirname";

dayjs.Ls.en.weekStart = 1;
const execAsync = promisify(exec);

const menuUrl = "http://kafemud.bilkent.edu.tr/kumanya_menusu.pdf";

interface MealName {
  tr: string;
  eng: string;
}

interface Meal {
  plates: MealName[];
  vegetarianPlate: MealName;
  calories: {
    standard: string;
    vegetarian: string;
  };
}

interface MealDay {
  date: Dayjs;
  lunch: Meal;
  dinner: Meal;
}

export interface MealList {
  entityTag: string;
  days: MealDay[];
}

const getMonday = (): Dayjs => dayjs().startOf("week").add(3, "hour");
export const getMealDateFormatted = (mealDay: MealDay): string => mealDay.date.format("dddd, DD/MM/YYYY");

const getEntityTag = (res: Response) => res.headers.get("ETag")?.replace(/^"|"$/g, "");

const parseMealPDF = async (buffer: Buffer, mealList: MealList): Promise<void> => {
  const parse = {
    error: false,
    default: "",
    raw: "",
  };

  await withFile(async ({ path: fp, fd }) => {
    fs.write(fd, buffer, (err) => {
      if (err) console.error(`Error from tempfile: ${err.name}, ${err.message}`);
    });

    try {
      parse.default = (await execAsync(`pdftotext ${fp} -`)).stdout.trim();
      parse.raw = (await execAsync(`pdftotext -raw ${fp} -`)).stdout.trim();
    } catch (error) {
      parse.error = true;
      console.error(error);
    }
  });
  if (parse.error) return;

  const plateLines = parse.raw.split("\n").slice(0, 70);
  const calorieLines = parse.default
    .split("\n")
    .slice(-50)
    .filter((line) => /^\d* kkal/.test(line))
    .map((line) => line.replace(/\s\/$/, ""));

  const getMealName = (line: string): MealName => {
    const split = line.split(/\s\/\s/);
    return {
      tr: split[0].replace(/^Vejetaryen\s/, ""),
      eng: split[1].replace(/\s\(Vegetarian\)$/, ""),
    };
  };

  const getBlankMealDay = () => ({
    plates: [],
    vegetarianPlate: { tr: "", eng: "" },
    calories: { standard: "", vegetarian: "" },
  });

  for (let i = 0; i !== 7; i++) {
    const mealDay: MealDay = {
      date: getMonday().add(i, "day"),
      lunch: getBlankMealDay(),
      dinner: getBlankMealDay(),
    };

    for (let j = 0; j !== 4; j++) {
      mealDay.lunch.plates.push(getMealName(plateLines[i * 10 + j]));
      mealDay.dinner.plates.push(getMealName(plateLines[i * 10 + 5 + j]));
    }
    mealDay.lunch.vegetarianPlate = getMealName(plateLines[i * 10 + 4]);
    mealDay.dinner.vegetarianPlate = getMealName(plateLines[i * 10 + 9]);

    [
      mealDay.lunch.calories.standard,
      mealDay.lunch.calories.vegetarian,
      mealDay.dinner.calories.standard,
      mealDay.dinner.calories.vegetarian,
    ] = calorieLines.slice(i * 4, i * 4 + 4);

    mealList.days.push(mealDay);
  }
};

let mealListCache: MealList;

const checkForUpdates = async (): Promise<boolean> => {
  const response = await fetch(menuUrl, { method: "HEAD" });
  const entityTag = getEntityTag(response);

  return !(entityTag === null || entityTag === mealListCache.entityTag);
};

const cacheMealList = async (writeJson = false): Promise<void> => {
  const response = await fetch(menuUrl);

  const mealList: MealList = {
    entityTag: getEntityTag(response) ?? "",
    days: [],
  };

  await parseMealPDF(await response.buffer(), mealList);
  if (writeJson)
    await fs.promises.writeFile(path.join(projrootdir, "meallist.json"), JSON.stringify(mealList, null, 2));

  mealListCache = mealList;
};

export const getMealList = async (): Promise<MealList> => {
  if (mealListCache === undefined || (await checkForUpdates())) await cacheMealList();
  return mealListCache;
};
