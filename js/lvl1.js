// всё начинает действовать только при загрузке страницы
window.onload = function () {
	//константы
	
	//количество оставшихся шагов на уровне
	let steps = 5
	//количество блоков для победы
	let need_to_win = 15
	//блок какого цвета нам нужно собирать
	let what_color_need_to_win = 0
	//количество цветов блоков на данном уровне
	let colors = 4;
	//размер поля
	let size = 10;
	//поле в html'e
	let field = document.querySelector('.field');
	//поле в js'e (двумерный массив)
	var arr = [];
	//размер блока в пикселях
	let sizeOfBlockPx = 45;
	//список уничтоженных блоков
	var killed_blocks = [];
	for (var i = 0; i < colors; i++) {
		killed_blocks[i] = 0
	}

	//заполняем массив блоков

	//0,1,2,3,4 - блок какого-либо цвета
	//6 - уничтожение всех элементов горизонтального ряда (бонус)
	//7 - уничтожение всех элементов вертикального ряда (бонус)
	//8 - уничтожение всех элементов вокруг себя (бонус)
	//9,10,11,12,13 - уничтожение всех элементов данного цвета (бонус)

	//от 0 до size*2 потому что нужны блоки, которые будут падать при исчезновении старых
	for (var i = 0; i < size * 2; i++) {
		arr[i] = [];
		for (var j = 0; j < size; j++) {
			//каждая ячейка получает блок случайного цвета
			arr[i][j] = Math.floor(Math.random() * colors);
		}
	}

	//функция отрисовки поля
	draw_on_start(field)
	function draw_on_start(field) {
		out = '';
		//от size до size*2 потому что нам не нужно отрисовывать запасные блоки
		for (var i = size; i < size * 2; i++) {
			for (var j = 0; j < size; j++) {
				for (var k = 0; k < 9 + colors; k++) {
					if (arr[i][j] == k) {
						//создание html эелмента
						out += '<img src="../../images/elem';
						out += k;
						out += '.png" alt="" class="blocks" id = ';
						out += 'block' + (i - size) + j;
						out += ' style="opacity: 1; top: '
						out += (i - size) * sizeOfBlockPx
						out += 'px; left: '
						out += j * sizeOfBlockPx
						out += 'px">';
					}
				}
			}
		}
		//добавление html элемента к html файлу
		field.innerHTML += out;

		//заполняем массив, в котором находятся ID всех наших блоков 
		blocks = []
		for (var i = 0; i < size; i++) {
			blocks[i] = []
			for (var j = 0; j < size; j++) {
				var id = ('#block' + i + j);
				blocks[i][j] = document.querySelector(id);
			}
		}

		//при нажатии на блок - вызывается функция clicked
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				blocks[i][j].onclick = clicked(arr, i + size, j);
			}
		}
	}

	//функция вызывается при нажатии пользователем на какой либо блок
	function clicked(arr, i, j) {
		return function () {
			//запоминаем значение ячейки
			now = arr[i][j];

			//смотрим значение нажатой ячейки и в зависимости от этого чтото делаем

			//если это обычный блок - надо удалить все блоки, которые к нему прислонены, и все их такие блоки, и все их ... 
			if (now < colors && now > -1) {
				//создание массивов
				var deleted = [];
				deleted[0] = 1
				list_of_i_1 = []
				list_of_j_1 = []
				list_of_i_2 = []
				list_of_j_2 = []
				list_of_i_1.push(i)
				list_of_j_1.push(j)
				list_of_i_2.push(i)
				list_of_j_2.push(j)
				array_i_j_value = 0
				killed_blocks[now] += 1

				//сам перебор блоков
				while (list_of_i_1.length != 0) {

					i_2 = list_of_i_1[0]
					j_2 = list_of_j_1[0]
					list_of_i_1.splice(0, 1);
					list_of_j_1.splice(0, 1);
					arr[i_2][j_2] = -1;

					if (i_2 != size) {
						clicked_find_all(i_2 - 1, j_2, arr, killed_blocks, deleted, now)
					}
					if (i_2 != size * 2 - 1) {
						clicked_find_all(i_2 + 1, j_2, arr, killed_blocks, deleted, now)
					}
					if (j_2 != 0) {
						clicked_find_all(i_2, j_2 - 1, arr, killed_blocks, deleted, now)
					}
					if (j_2 != size - 1) {
						clicked_find_all(i_2, j_2 + 1, arr, killed_blocks, deleted, now)
					}

					function clicked_find_all(i_3, j_3, arr, killed_blocks, deleted, now) {
						if (arr[i_3][j_3] == now) {
							list_of_i_2.push(i_3)
							list_of_j_2.push(j_3)
							list_of_i_1.push(i_3)
							list_of_j_1.push(j_3)
							arr[i_3][j_3] = -1;
							killed_blocks[now] += 1
							deleted[0] += 1
						}
					}
				}

				//если удалено более 4 блоков - надо добавить бонус
				if (deleted[0] > 4 && deleted[0] < 7) {
					if (Math.random() > 0.5) {
						arr[i][j] = 6
						array_i_j_value = 6
					}
					else {
						arr[i][j] = 7
						array_i_j_value = 7
					}
				}
				if (deleted[0] > 6 && deleted[0] < 9) {
					arr[i][j] = 8
					array_i_j_value = 8
				}
				if (deleted[0] > 8) {
					arr[i][j] = 9 + now
					array_i_j_value = 9 + now
				}

				//вызываем функцию анимации удаленных блоков
				animation_death_block(list_of_i_2, list_of_j_2, array_i_j_value, deleted[0])
			}

			// если это не обычный блок, а бонус - удаляем необходимые блоки в массиве (bonus_death_in_arr), а 
			// затем вызываем анимацию (bonus_death_animation)
			if (now == 6) {
				for (var jj = 0; jj < size; jj++) {
					bonus_death_in_arr(killed_blocks, i, jj, arr)
				}
				bonus_death_animation(i, j, now)
			}
			if (now == 7) {
				for (var ii = size; ii < size * 2; ii++) {
					bonus_death_in_arr(killed_blocks, ii, j, arr)
				}
				bonus_death_animation(i, j, now)
			}
			if (now == 8) {
				arr[i][j] = -1
				if (i != size && j != 0) {
					bonus_death_in_arr(killed_blocks, i - 1, j - 1, arr);
				}
				if (i != size && j != size - 1) {
					bonus_death_in_arr(killed_blocks, i - 1, j + 1, arr);
				}
				if (i != size) {
					bonus_death_in_arr(killed_blocks, i - 1, j, arr);
				}
				if (i != size * 2 - 1 && j != 0) {
					bonus_death_in_arr(killed_blocks, i + 1, j - 1, arr);
				}
				if (i != size * 2 - 1 && j != size - 1) {
					bonus_death_in_arr(killed_blocks, i + 1, j + 1, arr);
				}
				if (i != size * 2 - 1) {
					bonus_death_in_arr(killed_blocks, i + 1, j, arr);
				}
				if (j != 0) {
					bonus_death_in_arr(killed_blocks, i, j - 1, arr);
				}
				if (j != size - 1) {
					bonus_death_in_arr(killed_blocks, i, j + 1, arr);
				}
				bonus_death_animation(i, j, now)
			}
			if (now > 8) {
				n = now - 9
				arr[i][j] = -1
				bonus_death_animation(i, j, now)
				for (var i_2 = size; i_2 < size * 2; i_2++) {
					for (var j_2 = 0; j_2 < size; j_2++) {
						if (arr[i_2][j_2] == n) {
							killed_blocks[n] += 1
							arr[i_2][j_2] = -1
						}
					}
				}
			}

			//удаление необходимых блоков при нажатии на бонус
			function bonus_death_in_arr(killed_blocks, i_3, j_3, arr) {
				for (var k = 0; k < colors; k++) {
					if (arr[i_3][j_3] == k) {
						killed_blocks[k] += 1
					}
				}
				arr[i_3][j_3] = -1
			}

			//падение блоков, анимация
			for (var i_1 = 0; i_1 < size; i_1++) {
				for (var j_1 = 0; j_1 < size; j_1++) {
					for (var i_2 = i_1; i_2 < size; i_2++) {
						if (blocks[i_2][j_1].style.opacity == 0) {
							var re = /px/gi;
							var str = blocks[i_1][j_1].style.top;
							var newstr = str.replace(re, "");
							var mean = parseInt(newstr)
							mean += sizeOfBlockPx
							blocks[i_1][j_1].style.top = mean + "px"
						}
					}
				}
			}

			//падение блоков, в массиве
			for (var i_1 = 0; i_1 < size; i_1++) {
				for (var j_1 = size * 2 - 1; j_1 > size - 1; j_1--) {
					for (var j_2 = size - 1; j_2 > -1; j_2--) {
						if (arr[j_1][j_2] == -1) {
							for (var i_2 = j_1; i_2 > 0; i_2--) {
								if (i_2 != 0) {
									arr[i_2][j_2] = arr[i_2 - 1][j_2]
									arr[i_2 - 1][j_2] = -1
								}
							}
						}
					}
				}
			}

			//создание новых блоков, анимация (через 1100мс, потому что это время старые блоки будут падать и исчезать)
			setTimeout(fallBlocks, 1100);
			function fallBlocks() {
				//удаляется старое поле, и создаётся новое
				let elem = document.querySelector('.field');

				elem.parentNode.removeChild(elem);
				let container = document.querySelector('.container');
				out = ''
				out += '<div class="field"></div>'
				container.innerHTML += out;

				let field = document.querySelector('.field');

				//отрисовка нового поля
				draw_on_start(field)
			}

			//создание новых блоков в массиве
			for (var i_1 = 0; i_1 < size * 2; i_1++) {
				for (var j_1 = 0; j_1 < size; j_1++) {
					if (arr[i_1][j_1] == -1) {
						arr[i_1][j_1] = Math.floor(Math.random() * colors);
					}
				}
			}

			//вывод в консоль
			console.log(arr)
			console.log(killed_blocks)

			//меняем информацию о процессе уровня
			
			//сколько осталось уничтожить блоков
			n = need_to_win - killed_blocks[what_color_need_to_win]
			if (n < 0) n = 0
			let elem = document.querySelector('.p_need_to_win');
			elem.parentNode.removeChild(elem);
			let container = document.querySelector('.div_need_to_win');
			out = ''
			out += '<p class="p_need_to_win">Осталось: '
			out += n
			out += '</p>'
			container.innerHTML += out;

			//сколько осталось ходов
			steps -= 1
			let elem2 = document.querySelector('.p_steps');
			elem2.parentNode.removeChild(elem2);
			let container2 = document.querySelector('.div_steps');
			out = ''
			out += '<p class="p_steps">Осталось ходов: '
			out += steps
			out += '</p>'
			container2.innerHTML += out;

			//если кончились ходы - поражение, если сломали необходимое количество блоков - победа
			if (steps == 0 && n > 0) {
				setTimeout(alert, 1100, "YOU LOSE")
			}
			if (n < 1 && steps > -1) setTimeout(alert, 1100, "YOU WIN")
		}

	}

	//анимация исчезновения блоков при нажатии на обычный блок
	function animation_death_block(list_of_i_2, list_of_j_2, array_i_j_value, counter) {
		if (counter < 5) {
			for (var i = 0; i < list_of_i_2.length; i++) {
				blocks[list_of_i_2[i] - size][list_of_j_2[i]].style.opacity = '0'
			}
		}
		if (counter > 4 && counter < 7) {
			blocks[list_of_i_2[0] - size][list_of_j_2[0]].src = '../../images/elem'
			blocks[list_of_i_2[0] - size][list_of_j_2[0]].src += array_i_j_value
			blocks[list_of_i_2[0] - size][list_of_j_2[0]].src += '.png'
			for (var i = 1; i < list_of_i_2.length; i++) {
				blocks[list_of_i_2[i] - size][list_of_j_2[i]].style.opacity = '0'
			}
		}
		if (counter > 6 && counter < 9) {
			blocks[list_of_i_2[0] - size][list_of_j_2[0]].src = '../../images/elem8.png'
			for (var i = 1; i < list_of_i_2.length; i++) {
				blocks[list_of_i_2[i] - size][list_of_j_2[i]].style.opacity = '0'
			}
		}
		if (counter > 8) {
			out = '../../images/elem'
			out += array_i_j_value
			out += '.png'
			blocks[list_of_i_2[0] - size][list_of_j_2[0]].src = out
			for (var i = 1; i < list_of_i_2.length; i++) {
				blocks[list_of_i_2[i] - size][list_of_j_2[i]].style.opacity = '0'
			}
		}
	}

	//анимация исчезновения блоков при нажатии на бонус
	function bonus_death_animation(i, j, now) {
		i = i - size
		if (now == 6) {
			for (var jj = 0; jj < size; jj++) {
				blocks[i][jj].style.opacity = '0'
			}
		}
		if (now == 7) {
			for (var ii = 0; ii < size; ii++) {
				blocks[ii][j].style.opacity = '0'
			}
		}
		if (now == 8) {
			blocks[i][j].style.opacity = '0'
			if (j != 0) blocks[i][j - 1].style.opacity = '0'
			if (j != size - 1) blocks[i][j + 1].style.opacity = '0'
			if (i != 0) {
				blocks[i - 1][j].style.opacity = '0'
				if (j != 0) blocks[i - 1][j - 1].style.opacity = '0'
				if (j != size - 1) blocks[i - 1][j + 1].style.opacity = '0'
			}
			if (i != size - 1) {
				blocks[i + 1][j].style.opacity = '0'
				if (j != 0) blocks[i + 1][j - 1].style.opacity = '0'
				if (j != size - 1) blocks[i + 1][j + 1].style.opacity = '0'
			}
		}
		if (now > 8) {
			blocks[i][j].style.opacity = '0'
			for (var ii = size; ii < size * 2; ii++) {
				for (var jj = 0; jj < size; jj++) {
					if (arr[ii][jj] == now - 9) {
						blocks[ii - size][jj].style.opacity = '0'
					}
				}
			}
		}
	}
}