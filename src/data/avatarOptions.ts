import type {
  AvatarAccessoryId,
  AvatarConfig,
  AvatarOption,
  BrowShapeId,
  EyeColorId,
  HairColorId,
  HairStyleId,
  OutfitColorId,
  OutfitStyleId,
  SkinToneId,
} from '../types'

/**
 * The avatar is assembled from these catalogs by id. Adding a new hairstyle,
 * outfit or accessory later only needs a new entry here plus an optional
 * `unlockId` check in the builder, so shop unlocks can be added later without
 * changing the storage shape.
 */
export const skinTones: AvatarOption<SkinToneId>[] = [
  { id: 'porcelain', label: 'Фарфор', color: '#f4d6c4' },
  { id: 'light', label: 'Светлая', color: '#ecc3a7' },
  { id: 'warm', label: 'Тёплая', color: '#dfa87c' },
  { id: 'tan', label: 'Загорелая', color: '#c28255' },
  { id: 'brown', label: 'Коричневая', color: '#96603d' },
  { id: 'deep', label: 'Тёмная', color: '#633f2d' },
]

export const hairStyles: AvatarOption<HairStyleId>[] = [
  { id: 'short', label: 'Короткие' },
  { id: 'bob', label: 'Каре' },
  { id: 'long', label: 'Длинные' },
  { id: 'curly', label: 'Кудри' },
  { id: 'bun', label: 'Пучок' },
]

export const hairColors: AvatarOption<HairColorId>[] = [
  { id: 'ink', label: 'Чёрный', color: '#2c2630' },
  { id: 'chestnut', label: 'Каштан', color: '#6b4226' },
  { id: 'copper', label: 'Медь', color: '#b45f3c' },
  { id: 'honey', label: 'Мёд', color: '#c99a52' },
  { id: 'platinum', label: 'Светлый', color: '#e8dcc8' },
  { id: 'violet', label: 'Фиолетовый', color: '#7b5cc9' },
]

export const eyeColors: AvatarOption<EyeColorId>[] = [
  { id: 'brown', label: 'Карие', color: '#5a3a28' },
  { id: 'hazel', label: 'Ореховые', color: '#8a6a3b' },
  { id: 'green', label: 'Зелёные', color: '#4f7a5c' },
  { id: 'blue', label: 'Голубые', color: '#4a72a8' },
  { id: 'gray', label: 'Серые', color: '#6e7580' },
  { id: 'violet', label: 'Фиалковые', color: '#7b5cc9' },
]

export const browShapes: AvatarOption<BrowShapeId>[] = [
  { id: 'soft', label: 'Мягкие' },
  { id: 'straight', label: 'Прямые' },
  { id: 'arched', label: 'Изогнутые' },
]

export const outfitStyles: AvatarOption<OutfitStyleId>[] = [
  { id: 'tee', label: 'Футболка' },
  { id: 'hoodie', label: 'Худи' },
  { id: 'jacket', label: 'Куртка' },
]

export const outfitColors: AvatarOption<OutfitColorId>[] = [
  { id: 'lavender', label: 'Лаванда', color: '#7b6af0' },
  { id: 'mint', label: 'Мята', color: '#2b9d82' },
  { id: 'sunset', label: 'Закат', color: '#cf7350' },
  { id: 'ocean', label: 'Океан', color: '#4a7fc4' },
  { id: 'charcoal', label: 'Графит', color: '#4c4859' },
  { id: 'cream', label: 'Крем', color: '#d8c6a8' },
]

export const accessories: AvatarOption<AvatarAccessoryId>[] = [
  { id: 'none', label: 'Без дополнений' },
  { id: 'glasses', label: 'Очки' },
  { id: 'earrings', label: 'Серьги' },
]

export const defaultAvatar: AvatarConfig = {
  skinTone: 'warm',
  hairStyle: 'bob',
  hairColor: 'chestnut',
  eyeColor: 'brown',
  browShape: 'soft',
  outfitStyle: 'hoodie',
  outfitColor: 'lavender',
  accessory: 'none',
}
