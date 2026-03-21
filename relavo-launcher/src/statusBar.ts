import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

export function createStatusBarItem(): vscode.StatusBarItem {
    myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    myStatusBarItem.command = 'relavo.startAll';
    updateStatusBarItem('stopped');
    myStatusBarItem.show();
    return myStatusBarItem;
}

export function updateStatusBarItem(status: 'stopped' | 'starting' | 'running'): void {
    if (status === 'stopped') {
        myStatusBarItem.text = `$(play) Start Relavo`;
        myStatusBarItem.tooltip = 'Click to start all Relavo services';
        myStatusBarItem.command = 'relavo.startAll';
    } else if (status === 'starting') {
        myStatusBarItem.text = `$(sync~spin) Starting...`;
        myStatusBarItem.tooltip = 'Services are starting up...';
        myStatusBarItem.command = undefined;
    } else if (status === 'running') {
        myStatusBarItem.text = `$(stop-circle) Stop Relavo`;
        myStatusBarItem.tooltip = 'Click to stop all Relavo services';
        myStatusBarItem.command = 'relavo.stopAll';
    }
    myStatusBarItem.show();
}
