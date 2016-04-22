export class CallbackArray extends Array {
	public trigger(): void {
		this.forEach((individualCallback: Function) => {
			individualCallback();
		});
	}
}
