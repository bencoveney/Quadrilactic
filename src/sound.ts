interface ISoundOptions
{
	volume?: number;
	isLooping?: boolean;
}

class Sound {
	private static defaultVolume: number = 0.3;
	
	private sound: HTMLAudioElement;
	
	constructor(path: string, options: ISoundOptions)
	{
		this.sound = new Audio(path);
		this.sound.volume = options.volume || Sound.defaultVolume;
		this.sound.loop = options.isLooping === true;
	}
	
	public play()
	{
		this.sound.play();
	}
	
	public set volume(newVolume: number)
	{
		this.sound.volume = newVolume;
	}
}