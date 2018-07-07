var fs = require('fs')
var LineByLineReader = require('line-by-line')
var _ = require('lodash')

var bedfile2arr = async (path, beginnumber = 0, endnumber = 1000000, vacuate = false, vacuatecount = 1, ) => {
    return new Promise((res, rej) => {
        rl = new LineByLineReader(path)
        let arr = []
        let count = 0
        rl.on('line', function (line, lineCount, byteCount) {
            if (vacuate) {
                count += vacuatecount
            } else {
                count++
            }
            if (count == endnumber) {
                res(arr)
                rl.pause()
            }
            if (count >= beginnumber) {
                let l = line.split('\t')
                arr.push([l[1], l[2], l[3], l[0]])
            }
        }).on('end', function () {
            res(arr)
        }).on('err', function () {
            rej('err')
        })
    })
}

var bedfilereader = async (path, beginnumber, endnumber, op) => {
    let rl = new LineByLineReader(path)
    let arr = []
    let count = 0
    rl.on('line', function (line, lineCount, byteCount) {
        count++
        if (count == endnumber) {
            op('over')
            rl.pause()
        }
        if (count >= beginnumber) {
            let l = line.split('\t')
            op(l)
        }
    }).on('end', function () {
        op('over')
    }).on('err', function () {
        op('over')
    })
}


var ucscfile2arr = async (path, beginnumber = 1, endnumber = 100000) => {
    return new Promise((res, rej) => {
        rl = new LineByLineReader(path)
        let arr = []
        let count = 0
        let index = 0
        rl.on('line', function (line, lineCount, byteCount) {
            if (count > 0) {
                if (count == endnumber) {
                    res(arr)
                    rl.pause()
                }
                if (count >= beginnumber) {
                    let l = line.split('\t')
                    //console.log(l)
                    arr.push([l[4], l[5], l[6], l[7], l[3], l[9], l[10], index, l[1], l[2]])//, 
                    index++;
                }
            }
            count++
        }).on('end', function () {
            res(arr)
        }).on('err', function () {
            rej(err)
        })
    })
}

//基因数据排序
var ucscSort = (ucscArr) => {
    if (ucscArr.length <= 1) return ucscArr
    var pivotIndex = Math.floor(ucscArr.length / 2);
    var pivot = ucscArr.splice(pivotIndex, 1)[0];
    var left = [];
    var right = [];
    for (var i = 0; i < ucscArr.length; i++) {
        if (isbigger(ucscArr[i], pivot)) {
            left.push(ucscArr[i]);
        } else {
            right.push(ucscArr[i]);
        }
    }
    return ucscSort(left).concat([pivot], ucscSort(right));
}
var isbigger = (ucsc1, ucsc2) => {
    return Number(ucsc1[0]) < Number(ucsc2[0])
}
var isOverlap = (ucsc1, ucsc2) => {
    //max(a1, a2) < min(b1, b2)
    var a1 = parseInt(ucsc1.txStart)
    var a2 = parseInt(ucsc1.txEnd)

    var b1 = parseInt(ucsc2.txStart)
    var b2 = parseInt(ucsc2.txEnd)

    // if (a1 <= b1 && a2 <= b2 && a1 < b2 && a2 < b1) return false
    // if (a1 >= b1 && a2 >= b2 && a1 > b2 && a2 > b1) return false

    if (Math.max(a1, b1) <= Math.min(a2, b2)) return true

    return false
}
//分组.. 数据不重叠的丢到一个组里面,重叠的放在下一个
var ucscGroup = (ucscArr, index) => {
    let group = []
    var pivot = ucscArr.splice(0, 1)[0];
    group.push(pivot)
    for (let i = ucscArr.length - 1; i >= 0; i--) {
        const element = ucscArr[i];
        var overlap = false
        for (let j = 0; j < group.length; j++) {
            const groupitem = group[j];
            var result = isOverlap(groupitem, element)
            if (result) {
                //有一个包含就跳出循环
                //console.log(`groupitem:${groupitem.txStart} element:${element.txStart}`)
                overlap = true
                //break
            }
        }
        //console.log(overlap)
        if (!overlap) {
            group.push(element)
            ucscArr.splice(i, 1)
        }
    }
    // console.log(`第${index}号,分组完成!长度为:${group.length},完成后原数组长度:${ucscArr.length}`)
    // console.log('-------------------------------------')
    return group
}

var GetUcscGroupArr = async (array) => {
    var data2 = []
    var index = 0
    while (array.length > 0) {
        var tmp = ucscGroup(array, index)
        for (let i = 0; i < tmp.length; i++) {
            const item = tmp[i];
            data2.push([0, index, item.txStart, item.txEnd, item.cdsStart, item.cdsEnd, item.strand, item.exonStarts, item.exonEnds, item.Name])
        }
        index++
    }
    return { data: data2, groupcount: index }
}





exports.BedFileReader = bedfilereader

exports.BedFile2Arr = bedfile2arr
exports.UcscFile2Arr = ucscfile2arr
exports.GroupArr = GetUcscGroupArr
