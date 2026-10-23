import {
  accessories,
  browShapes,
  defaultAvatar,
  eyeColors,
  hairColors,
  hairStyles,
  outfitColors,
  outfitStyles,
  skinTones,
} from '../data/avatarOptions'
import type { AvatarConfig, AvatarOption } from '../types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readOption<T extends string>(
  value: unknown,
  options: AvatarOption<T>[],
  fallback: T,
): T {
  return typeof value === 'string' && options.some((option) => option.id === value)
    ? (value as T)
    : fallback
}

/** Keeps every field valid while preserving all recognizable saved choices. */
export function sanitizeAvatarConfig(value: unknown): AvatarConfig {
  const source = isRecord(value) ? value : {}

  return {
    skinTone: readOption(source.skinTone, skinTones, defaultAvatar.skinTone),
    hairStyle: readOption(source.hairStyle, hairStyles, defaultAvatar.hairStyle),
    hairColor: readOption(source.hairColor, hairColors, defaultAvatar.hairColor),
    eyeColor: readOption(source.eyeColor, eyeColors, defaultAvatar.eyeColor),
    browShape: readOption(source.browShape, browShapes, defaultAvatar.browShape),
    outfitStyle: readOption(
      source.outfitStyle,
      outfitStyles,
      defaultAvatar.outfitStyle,
    ),
    outfitColor: readOption(
      source.outfitColor,
      outfitColors,
      defaultAvatar.outfitColor,
    ),
    accessory: readOption(source.accessory, accessories, defaultAvatar.accessory),
  }
}

export function getAvatarColor<T extends string>(
  options: AvatarOption<T>[],
  id: T,
  fallback: string,
): string {
  return options.find((option) => option.id === id)?.color ?? fallback
}

export function getDefaultAvatar(): AvatarConfig {
  return { ...defaultAvatar }
}
