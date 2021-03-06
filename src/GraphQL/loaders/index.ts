import DataLoader from 'dataloader'

import models from '../models'
import batchUsers from './user'
import batchProducts from './product'
import batchCategories from './category'

export const userLoader = new DataLoader((keys: string[]) => batchUsers(keys, models))
export const productLoader = new DataLoader((keys: string[]) => batchProducts(keys, models))
export const categoryLoader = new DataLoader((keys: string[]) => batchCategories(keys, models))
