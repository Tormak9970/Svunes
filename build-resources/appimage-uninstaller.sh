#!/bin/bash
# Author: Travis Lane

errorRed='\033[1;91m'
warningYellow='\033[1;93m'
tipBlue='\033[1;94m'
successGreen='\033[1;96m'
infoCyan='\033[1;92m'
noColor='\033[0m'

if zenity --question --title="Warning!" --text="You are about to uninstall Svunes and all of its files.\n\n Are you sure you want to proceed?" --width=600; then
  echo -e "${infoCyan}[INFO]${noColor}: Uninstalling Svunes..."
  echo ""

  # Delete install directory
  if [ -d "$HOME/.svunes" ]; then
    rm -rf "$HOME/.svunes"
    echo -e "${successGreen}[INFO]${noColor}: Removed Svunes directory."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Svunes directory already removed."
  fi

  # Remove Desktop icons
  if [ -d "$HOME/Desktop/svunes.desktop" ]; then
    rm -rf "$HOME/Desktop/svunes.desktop"
    echo -e "${successGreen}[INFO]${noColor}: Removed Svunes desktop launch shortcut."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Svunes desktop launch shortcut already removed."
  fi

  if [ -d "$HOME/Desktop/uninstall-svunes.desktop" ]; then
    rm -rf "$HOME/Desktop/uninstall-svunes.desktop"
    echo -e "${successGreen}[INFO]${noColor}: Removed Svunes desktop uninstall shortcut."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Svunes desktop uninstall shortcut already removed."
  fi

  # Remove Start Menu shortcuts
  if [ -d "$HOME/.local/share/applications/svunes.desktop" ]; then
    rm -rf "$HOME/.local/share/applications/svunes.desktop"
    echo -e "${successGreen}[INFO]${noColor}: Removed Svunes start menu launch shortcut."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Svunes start menu launch shortcut already removed."
  fi

  if [ -d "$HOME/.local/share/applications/uninstall-svunes.desktop" ]; then
    rm -rf "$HOME/.local/share/applications/uninstall-svunes.desktop"
    echo -e "${successGreen}[INFO]${noColor}: Removed Svunes start menu uninstall shortcut."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Svunes start menu uninstall shortcut already removed."
  fi

  # Remove cache directory
  if [ -d "$HOME/.cache/dev.travislane.svunes" ]; then
    rm -rf "$HOME/.cache/dev.travislane.svunes"
    echo -e "${successGreen}[INFO]${noColor}: Removed Svunes cache directory."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Svunes cache directory already removed."
  fi

  # Remove config directory
  if [ -d "$HOME/.config/dev.travislane.svunes" ]; then
    rm -rf "$HOME/.config/dev.travislane.svunes"
    echo -e "${successGreen}[INFO]${noColor}: Removed Svunes config directory."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Svunes config directory already removed."
  fi

  # Remove Tauri Runtime Files
  if [ -d "$HOME/.local/share/dev.travislane.svunes" ]; then
    rm -rf "$HOME/.local/share/dev.travislane.svunes"
    echo -e "${successGreen}[INFO]${noColor}: Removed Svunes Tauri runtime files."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Svunes Tauri runtime files already removed."
  fi

  update-desktop-database $HOME/.local/share/applications
  echo -e "${successGreen}[INFO]${noColor}: Updated .desktop database."

  echo ""

  echo -e "${successGreen}[INFO]${noColor}: Successfully uninstalled Svunes. If this was because you ran into an issue, please open a GitHub issue so I can get it fixed!"
fi