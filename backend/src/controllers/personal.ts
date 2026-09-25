import { Request, Response } from 'express';
import { prisma } from '../database/client';
import { asyncHandler } from '../middleware';

export const personalController = {
  getMedia: asyncHandler(async (req: Request, res: Response) => {
    const media = await prisma.personalMedia.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(media);
  }),

  getLinuxSetup: asyncHandler(async (req: Request, res: Response) => {
    const setup = await prisma.linuxSetup.findFirst({ orderBy: { createdAt: 'desc' } });
    if (!setup) {
      return res.json({
        distribution: 'Arch Linux',
        windowManager: 'Hyprland',
        terminal: 'Kitty',
        shell: 'Zsh',
        editor: 'Neovim',
        tools: ['btop', 'fzf', 'ripgrep', 'fd', 'eza', 'zoxide', 'lazygit', 'docker', 'kubectl'],
        hardware: { cpu: 'AMD Ryzen 9 7950X', ram: '64GB DDR5', gpu: 'RTX 4090' },
        dotfilesUrl: 'https://github.com/user/dotfiles',
      });
    }
    res.json(setup);
  }),
};