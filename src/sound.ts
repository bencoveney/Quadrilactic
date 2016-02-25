class Sound {
	private sound: HTMLAudioElement;
	
	constructor(path: string)
	{
		this.sound = new Audio(path);
		this.sound.volume = 0.5;
	}
	
	public play()
	{
		this.sound.play();
	}
}