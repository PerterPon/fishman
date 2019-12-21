
/*
* mind.ts
* Author: perterpon<perterpon@gmail.com>
* Create: Fri Oct 25 2019 18:27:22 GMT+0800 (China Standard Time)
*/

import chalk from 'chalk';
import { Bitmap } from 'robotjs';
import * as _ from 'lodash';

import vision from 'src/vision';

import { judgeSituation, getSituation, getAllSituation, fullSituationJudge, quickSituationJudge } from 'src/situation';
import { getSituationProbability, updateSituationProbability, situations, getSituationModel, updateSituationFeatureMap } from 'src/model/situation';
import { recall } from 'src/body/memory';
import { getTemplate } from 'src/model/template';
import { templateJudge } from 'src/ability/image_id';

import { ETemplate, EFeature } from 'src/constants/enums';

import { TSituation, TSituationProbabilityModel, TPoint, TPointTemplate, TBitmap, TMemory, TAction, TSituationModel, TFeatureMap, TRect, TFeature, TSize, TFeatureMemories } from "fishman";
import { imgTemplateJudge } from 'src/util';
import { look } from './eye';
import { TOTAL_VISION } from 'src/constants';
import { getFeature } from 'src/feature';

export function calculateGlobalSituation(): TSituation {
  // 1. look current picture
  look([TOTAL_VISION]);

  // 2. get all situations
  const allSituations: string[] = getAllSituation();
  const memory: TMemory[] = recall(10);

  // 3. start judge
  let targetSituation: TSituation = null;
  for (let i = 0; i < allSituations.length; i++) {
    const sName: string = allSituations[i];
    const featureMap: TFeatureMap = fullSituationJudge(sName, memory);
    if (null !== featureMap) {
      // update situation feature map
      updateSituationFeatureMap(sName, featureMap);
      targetSituation = getSituation(sName);
      break;
    }
  }

  return targetSituation;
}

export function calculateNextSituation(currentSituation: TSituation): TSituation {

  debugger;
  const situationMap: TSituationModel = getSituationModel(currentSituation.name);
  const spModel: TSituationProbabilityModel[] = situationMap.probability;

  let globalMemory: TMemory = null;
  let targetSituation: TSituation = null;
  for (let i = 0; i < spModel.length; i++) {
    const sName: string = spModel[i].name;

    const situation: TSituation = getSituation(sName);
    let featureMap: TFeatureMap = null;
    // 1. get situation feature map
    const sModel: TSituationModel = getSituationModel(sName);
    // 1.1 no situation model, do full situation judge
    if (undefined === sModel || true === _.isEmpty(sModel.featureMap)) {
      console.log(`calculate next situation but with situation model, enter full scan`);
      if (null === globalMemory) {
        globalMemory = look([TOTAL_VISION]);
      }
      featureMap = fullSituationJudge(sName, [globalMemory]);
      // not this situation, continue
      if (null === featureMap) {
        continue;
      }
      updateSituationFeatureMap(sName, featureMap);
      targetSituation = situation;
      break;
    }

    // 2.1 generate view rects
    debugger;
    const viewRects: TRect[] = _.values(sModel.featureMap);
    const memory: TMemory = look(viewRects);
    // 2.2 pack feature memory
    const features: string[] = _.keys(sModel.featureMap);
    const featureMemory: TFeatureMemories = {};
    for (let j = 0; j < features.length; j++) {
      const fName: string = features[j];
      featureMemory[fName] = {
        rect: viewRects[j],
        picture: memory.pictures[j]
      };
    }
    memory.features = featureMemory;
    debugger;
    const judgeResult: boolean = quickSituationJudge(sName, [memory]);
    // quick judge without result
    if (false === judgeResult) {
      if (null === globalMemory) {
        globalMemory = look([TOTAL_VISION]);
      }
      console.log(`calculate next situation, but can not get result from quick situation judge, enter full scan`);
      featureMap = fullSituationJudge(sName, [globalMemory]);
      if (null !== featureMap) {
        updateSituationFeatureMap(sName, featureMap);
        targetSituation = situation;
        break;
      }
    }
    targetSituation = situation;
    break;
  }

  if (null === targetSituation) {
    targetSituation = calculateGlobalSituation();
  }

  if (null !== targetSituation) {
    updateSituationProbability(currentSituation.name, targetSituation.name);
  }

  return targetSituation;

}
