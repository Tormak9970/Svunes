#!/bin/bash
# Author: Travis Lane

errorRed='\033[1;91m'
warningYellow='\033[1;93m'
tipBlue='\033[1;94m'
successGreen='\033[1;96m'
infoCyan='\033[1;92m'
noColor='\033[0m'

comment="A robust, offline first Material Design music player."
uninstallComment="Uninstalls all files related to Svunes."

currentVersion="v2.9.0"

# Show starting message.
echo -e "${infoCyan}[INFO]${noColor}: Installing Svunes $currentVersion..."
echo ""
echo -e "${tipBlue}[TIP]${noColor}: If Svunes doesn't install, try closing this window and running it again. Sometimes it takes 3-5 attempts to install, looking into the cause."

# Check for a Github.com connection
echo -e "${infoCyan}[INFO]${noColor}: Checking connection to GitHub.com..."
case "$(curl -s --max-time 2 -I http://github.com | sed 's/^[^ ]*  *\([0-9]\).*/\1/; 1q')" in
  [23])
    echo -e "${successGreen}[INFO]${noColor}: Able to reach Github.com"
    ;;
  5)
    echo -e "${errorRed}[ERROR]${noColor}: The web proxy won't let requests through."
    read -p "Press any key to quit the installer"
    exit 1
    ;;
  *)
    echo -e "${errorRed}[ERROR]${noColor}: The network is down or very slow."
    read -p "Press any key to quit the installer"
    exit 1
    ;;
esac

# Check if the .svunes directory already exists.
if [ -d "$HOME/.svunes" ]; then
  echo -e "${successGreen}[INFO]${noColor}: Svunes Directory Exists."
else
  mkdir $HOME/.svunes
  echo -e "${successGreen}[INFO]${noColor}: Made Svunes Directory."
fi
echo ""

# Download the latest appimage from GitHub.
rm -rf "$HOME"/.svunes/svunes.AppImage 2>/dev/null
echo -e "${infoCyan}[INFO]${noColor}: Downloading AppImage..."
curl -L https://github.com/Tormak9970/Svunes/releases/download/$currentVersion/svunes.AppImage --output ~/.svunes/svunes.AppImage 
chmod 700 ~/.svunes/svunes.AppImage
echo -e "${successGreen}[INFO]${noColor}: Downloaded AppImage."
echo ""

# Download the uninstall script from GitHub.
rm -rf "$HOME"/.svunes/appimage-uninstaller.sh 2>/dev/null
echo -e "${infoCyan}[INFO]${noColor}: Downloading Uninstall Script..."
curl -L https://raw.githubusercontent.com/Tormak9970/Svunes/$currentVersion/build-resources/appimage-uninstaller.sh --output ~/.svunes/appimage-uninstaller.sh
chmod 700 ~/.svunes/linux-uninstaller.sh
echo -e "${successGreen}[INFO]${noColor}: Downloaded Uninstall Script."
echo ""

# Download the icon from GitHub.
rm -rf "$HOME"/.svunes/svunes.png 2>/dev/null
echo -e "${infoCyan}[INFO]${noColor}: Downloading Icon..."
curl https://raw.githubusercontent.com/Tormak9970/Svunes/$currentVersion/public/logo.png --output ~/.svunes/svunes.png
echo -e "${successGreen}[INFO]${noColor}: Downloaded Icon."
echo ""


absSvunesPath="$HOME/.svunes"
appImagePath="$absSvunesPath/svunes.AppImage"
iconPath="$absSvunesPath/svunes.png"

cd $absSvunesPath
xdg-icon-resource install svunes.png --size 64
xdg-icon-resource install svunes.png --size 128
xdg-icon-resource install svunes.png --size 256
echo -e "${successGreen}[INFO]${noColor}: Updated Icon Database."
echo ""


echo -e "${infoCyan}[INFO]${noColor}: Making Shortcuts..."

# Create the launcher .desktop.
read -r -d '' openSvunesContents <<- EOM
#!/usr/bin/env xdg-open
[Desktop Entry]
Comment=$comment
Name=Svunes
Exec=GTK_USE_PORTAL=1 WEBKIT_DISABLE_COMPOSITING_MODE=1 $appImagePath
Icon=$iconPath
Terminal=false
Type=Application
Categories=Utility
StartupNotify=false

EOM

uninstallScriptPath="$absSvunesPath/appimage-uninstaller.sh"

# Create the uninstaller .desktop.
read -r -d '' uninstallSvunesContent <<- EOM
#!/usr/bin/env xdg-open
[Desktop Entry]
Comment=$uninstallComment
Name=Uninstall Svunes
Exec=$uninstallScriptPath
Icon=delete
Terminal=true
Type=Application
Categories=Utility
StartupNotify=false

EOM

# Create the start menu launcher.
rm -rf "$HOME"/.local/share/applications/svunes.desktop 2>/dev/null
echo -e "$openSvunesContents" >> $HOME/.local/share/applications/svunes.desktop
chmod 700 $HOME/.local/share/applications/svunes.desktop
echo -e "${successGreen}[INFO]${noColor}: Made Start Menu Shortcut."

# Create the desktop launcher.
rm -rf "$HOME"/Desktop/svunes.desktop 2>/dev/null
echo -e "$openSvunesContents" >> $HOME/Desktop/svunes.desktop
chmod 700 $HOME/Desktop/svunes.desktop
echo -e "${successGreen}[INFO]${noColor}: Made Desktop Shortcut."

# Create the start menu uninstaller.
rm -rf "$HOME"/.local/share/applications/uninstall-svunes.desktop 2>/dev/null
echo -e "$uninstallSvunesContent" >> $HOME/.local/share/applications/uninstall-svunes.desktop
chmod 700 $HOME/.local/share/applications/uninstall-svunes.desktop
echo -e "${successGreen}[INFO]${noColor}: Made Start Menu Uninstall Shortcut."

# Create the desktop uninstaller.
rm -rf "$HOME"/Desktop/uninstall-svunes.desktop 2>/dev/null
echo -e "$uninstallSvunesContent" >> $HOME/Desktop/uninstall-svunes.desktop
chmod 700 $HOME/Desktop/uninstall-svunes.desktop
echo -e "${successGreen}[INFO]${noColor}: Made Desktop Uninstall Shortcut."

echo -e "${successGreen}[INFO]${noColor}: Finished Making Shortcuts."
echo ""

# Update .desktop database.
update-desktop-database $HOME/.local/share/applications
echo -e "${successGreen}[INFO]${noColor}: Updated .desktop database."
echo ""

echo -e "${successGreen}[INFO]${noColor}: Instalation of Svunes $currentVersion complete."
echo ""
echo -e "${tipBlue}[TIP]${noColor}: Feel free to delete this script. Svunes will notify you when new updates are available!"