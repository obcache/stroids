#define MyAppVersion "0.1.0"
#define MyAppName "STROIDS"
[Setup]
AppId={{5D02F9DC-CC71-4C27-B2B1-A5EF92B73952}
AppName={#MyAppName}
AppVersion=0.1.0
VersionInfoVersion=0.1.0
DefaultDirName={localappdata}\Programs\STROIDS
DefaultGroupName=STROIDS
PrivilegesRequired=lowest
OutputDir=..\dist
OutputBaseFilename=STROIDS-Setup-{#MyAppVersion}
SetupIconFile=..\public\icon.ico
UninstallDisplayIcon={app}\STROIDS.exe
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
DisableProgramGroupPage=yes
[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Shortcuts:"; Flags: unchecked
[Files]
Source: "..\dist\desktop\STROIDS-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
[Icons]
Name: "{autoprograms}\STROIDS"; Filename: "{app}\STROIDS.exe"
Name: "{autodesktop}\STROIDS"; Filename: "{app}\STROIDS.exe"; Tasks: desktopicon
[Run]
Filename: "{app}\STROIDS.exe"; Description: "Launch STROIDS"; Flags: nowait postinstall skipifsilent
