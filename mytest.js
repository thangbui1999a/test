


console.log('testing...')

function sleep(millisecs){
	return new Promise((resolve)=>{
		setTimeout(()=>{
			
			console.log('tested ok2!')
			resolve('ok')
		}, 
		millisecs)
	})
}
sleep(10000)


