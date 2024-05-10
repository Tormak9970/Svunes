#!/bin/bash
# Author: Tormak

errorRed='\033[1;91m'
warningYellow='\033[1;93m'
tipBlue='\033[1;94m'
successGreen='\033[1;96m'
infoCyan='\033[1;92m'
noColor='\033[0m'

if zenity --question --title="Warning!" --text="You are about to uninstall Tunistic and all of its files.\n\n Are you sure you want to proceed?" --width=600; then
  echo -e "${infoCyan}[INFO]${noColor}: Uninstalling Tunistic..."
  echo ""

  # Delete install directory
  if [ -d "$HOME/.sarm" ]; then
    rm -rf "$HOME/.sarm"
    echo -e "${successGreen}[INFO]${noColor}: Removed Tunistic directory."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Tunistic directory already removed."
  fi

  # Remove Desktop icons
  if [ -d "$HOME/Desktop/tunistic.desktop" ]; then
    rm -rf "$HOME/Desktop/tunistic.desktop"
    echo -e "${successGreen}[INFO]${noColor}: Removed Tunistic desktop launch shortcut."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Tunistic desktop launch shortcut already removed."
  fi

  if [ -d "$HOME/Desktop/uninstall-tunistic.desktop" ]; then
    rm -rf "$HOME/Desktop/uninstall-tunistic.desktop"
    echo -e "${successGreen}[INFO]${noColor}: Removed Tunistic desktop uninstall shortcut."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Tunistic desktop uninstall shortcut already removed."
  fi

  # Remove Start Menu shortcuts
  if [ -d "$HOME/.local/share/applications/tunistic.desktop" ]; then
    rm -rf "$HOME/.local/share/applications/tunistic.desktop"
    echo -e "${successGreen}[INFO]${noColor}: Removed Tunistic start menu launch shortcut."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Tunistic start menu launch shortcut already removed."
  fi

  if [ -d "$HOME/.local/share/applications/uninstall-tunistic.desktop" ]; then
    rm -rf "$HOME/.local/share/applications/uninstall-tunistic.desktop"
    echo -e "${successGreen}[INFO]${noColor}: Removed Tunistic start menu uninstall shortcut."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Tunistic start menu uninstall shortcut already removed."
  fi

  # Remove cache directory
  if [ -d "$HOME/.cache/dev.tormak.tunistic" ]; then
    rm -rf "$HOME/.cache/dev.tormak.tunistic"
    echo -e "${successGreen}[INFO]${noColor}: Removed Tunistic cache directory."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Tunistic cache directory already removed."
  fi

  # Remove config directory
  if [ -d "$HOME/.config/dev.tormak.tunistic" ]; then
    rm -rf "$HOME/.config/dev.tormak.tunistic"
    echo -e "${successGreen}[INFO]${noColor}: Removed Tunistic config directory."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Tunistic config directory already removed."
  fi

  # Remove Tauri Runtime Files
  if [ -d "$HOME/.local/share/dev.tormak.tunistic" ]; then
    rm -rf "$HOME/.local/share/dev.tormak.tunistic"
    echo -e "${successGreen}[INFO]${noColor}: Removed Tunistic Tauri runtime files."
  else
    echo -e "${infoCyan}[INFO]${noColor}: Tunistic Tauri runtime files already removed."
  fi

  update-desktop-database $HOME/.local/share/applications
  echo -e "${successGreen}[INFO]${noColor}: Updated .desktop database."

  echo ""

  echo -e "${successGreen}[INFO]${noColor}: Successfully uninstalled Tunistic. If this was because you ran into an issue, please open a GitHub issue so I can get it fixed!"
fi