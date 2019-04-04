$(document).ready(function(){
let images = [];

function readURL(input) {
	let $inputImages = $('input[type=file]');
	for(let i=0 ;i<$inputImages[0].files.length;i++){
		images.push($inputImages[0].files[i]);
	}
	console.log(images);
	imagesCard(images,true);
}

function imagesCard(input,addImage){
	for(let i=0;i<input.length;i++){
		let reader = new FileReader();
		console.log('asd')
			reader.onload = function(e){

				if(addImage == true){
					let $imageCard = $(`
							<div class="card">
								<img src="${e.target.result}">
								<div class="card-panel grey lighten-5 z-depth-1 center-align">
									<p class="truncate">${images[i].name}</p>
								</div>
								<a class="btn-floating btn-small waves-effect waves-light rem red" image="${images[i].name}"><i class="material-icons">remove_circle_outline</i></a>
							</div>
					  			 `);
					$('#imagesBox .row').append($imageCard);
				}


					$('.collapsible-header').append($(`<a href="${e.target.result}" data-lightbox="roadtrip" class="imageStyle"><img src="${e.target.result}" /></a>`));
					hideImages('h5.replace');
				jQuery('.rem').click((e)=>{
					let nameImg = $(e.currentTarget).attr('image');
					images.forEach((elem,index)=>{
						if(elem.name == nameImg){
							images.splice(index,1);
							return false;
						}
					})
					$(e.currentTarget).parent().remove();
				})
			}
			reader.readAsDataURL(input[i]);
	}

}

function uploadImages(id){
	if(id && images.length == 0){
		M.toast({html: 'Post został dodany bez zdjęć'})
	}
	for(let i=0;i<images.length;i++){
			let file = images[i];
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e){
				let result = e.target.result;
				let fileName = images[i].name;
				$.post(saveImages,{
					data: result,
					name: fileName,
					idPost: id
				},
				function(d,s){
					console.log(d,s)
				});
			}
		}
}

	$('button').click(function(){
		let tit = $('input[name=title]').val();
		let bod = $('textarea[name=body]').val();
		
		$.post(createPosts,
			{
				title: tit,
				body: bod
			},
			function(data,status){
				console.log(data);
				let myJsonString = JSON.parse(data);
				console.log(myJsonString);
				if(myJsonString.status === true){
					uploadImages(myJsonString.Id);
				}
				if(myJsonString.error){
					M.toast({html: myJsonString.error});
				}else{
					M.toast({html: myJsonString.text});
				}
			}
		);
	});

	/*preview the allpost*/
	$('#preview').click(()=>{

		let title = $('input[name=title]').val();
		let body = $('textarea[name=body]').val();

		$('h3.replace').replaceWith('<h3 class="letterSpac replace">'+ title +'</h3>');
		$('p.replace').replaceWith('<p class="right-align replace">aktualna data</p>');
		$('h5.replace').replaceWith('<h5 class="letterSpac border replace">'+ body +'</h5>');
		imagesCard(images,true)
	})

	/*upload images*/
	$('#upload').click(()=>{
		$('input[type=file]').click();
	});
	$('input[type=file]').change((e)=>{
		readURL(e);
	});

});
